using MiniCRM.Services;
using MiniCRM.Services;
using MiniCRM.Services.Ingestion;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using MiniCRM.Server.Data;
using MiniCRM.Server.Entities;
using MiniCRM.Server.Seeders;
using MiniCRM.Server.Services;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.SemanticKernel;
using Npgsql;
using Microsoft.SemanticKernel.Connectors.PgVector;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IJwtService, JwtService>();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing configuration: ConnectionStrings:DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!))
            };
    });

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header
        });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = []
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
    );
});

var credential = new ApiKeyCredential(builder.Configuration["OpenAi:Key"] ?? throw new InvalidOperationException("Missing configuration: GitHubModels:Token. See the README for details."));
var openAIOptions = new OpenAIClientOptions()
{
    Endpoint = new Uri("https://openrouter.ai/api/v1")
};

var ghModelsClient = new OpenAIClient(credential, openAIOptions);
var chatClient = ghModelsClient.GetChatClient(builder.Configuration["ModelName"] ?? throw new InvalidOperationException("Missing configuration: ModelName")).AsIChatClient();
var embeddingGenerator = ghModelsClient.GetEmbeddingClient("openai/text-embedding-3-small").AsIEmbeddingGenerator();

var testEmbedding = await embeddingGenerator.GenerateAsync("policies");
Console.WriteLine($"Embedding dims: {testEmbedding.Vector.Length}");
Console.WriteLine($"First 5 values: {string.Join(", ", testEmbedding.Vector.ToArray().Take(5))}");

//var vectorStorePath = Path.Combine(AppContext.BaseDirectory, "vector-sto  re.db");
//var vectorStoreConnectionString = $"Data Source={vectorStorePath}";
builder.Services.AddSingleton<NpgsqlDataSource>(_ =>
{
    var dsb = new NpgsqlDataSourceBuilder(connectionString);
    dsb.UseVector();
    return dsb.Build();
});
builder.Services.AddPostgresVectorStore();
builder.Services.AddPostgresCollection<Guid, IngestedChunk>(
    IngestedChunk.CollectionName);
builder.Services.AddSingleton<DataIngestor>();
builder.Services.AddSingleton<SemanticSearch>();
builder.Services.AddKeyedSingleton("ingestion_directory", new DirectoryInfo(Path.Combine(builder.Environment.WebRootPath, "Data")));
builder.Services.AddChatClient(chatClient).UseFunctionInvocation().UseLogging();
builder.Services.AddEmbeddingGenerator(embeddingGenerator);
builder.Services.AddScoped<ChatService>();

// Image Upload Service
builder.Services.AddScoped<FileUploadService>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

await db.Database.MigrateAsync();
await RoleSeeder.SeedAsync(
    scope.ServiceProvider);

await UserSeeder.SeedAsync(
    scope.ServiceProvider);

// Configure the HTTP request pipeline.


app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(errApp =>
    {
        errApp.Run(async ctx =>
        {
            ctx.Response.StatusCode = 500;
            ctx.Response.ContentType = "application/json";
            var error = ctx.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
            if (error != null)
            {
                await ctx.Response.WriteAsJsonAsync(new
                {
                    message = error.Error.Message,
                    type = error.Error.GetType().Name
                });
            }
        });
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");
app.UseStaticFiles(); // Must exist

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
