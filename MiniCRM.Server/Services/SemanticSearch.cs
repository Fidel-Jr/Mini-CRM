using MiniCRM.Services.Ingestion;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.VectorData;

namespace MiniCRM.Services;

public class SemanticSearch(
    VectorStoreCollection<Guid, IngestedChunk> vectorCollection,
    IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator,
    [FromKeyedServices("ingestion_directory")] DirectoryInfo ingestionDirectory,
    DataIngestor dataIngestor)
{
    private Task? _ingestionTask;

    //public async Task LoadDocumentsAsync() => await (_ingestionTask ??= dataIngestor.IngestDataAsync(ingestionDirectory, searchPattern: "*.*"));

    public async Task LoadDocumentsAsync()
    {
        await (_ingestionTask ??= EnsureDocumentsLoadedAsync());
    }

    private async Task EnsureDocumentsLoadedAsync()
    {
        var vectorDbPath = Path.Combine(
            AppContext.BaseDirectory,
            "vector-store.db");

        if (File.Exists(vectorDbPath))
        {
            return;
        }

        await dataIngestor.IngestDataAsync(
            ingestionDirectory,
            "*.*");
    }


    public async Task<IReadOnlyList<IngestedChunk>> SearchAsync(
    string text,
    string? documentIdFilter,
    int maxResults)
    {
        await LoadDocumentsAsync();

        await File.AppendAllTextAsync(
       Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
       $"{DateTime.Now}: Query = {text}\n");

        var embedding = await embeddingGenerator.GenerateAsync(text);
        Console.WriteLine($"Embedding length: {embedding.Vector.Length}");
        await File.AppendAllTextAsync(
        Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
        $"{DateTime.Now}: Embedding length = {embedding.Vector.Length}\n");

        var nearest = vectorCollection.SearchAsync(text, maxResults, new VectorSearchOptions<IngestedChunk>
        {
            Filter = documentIdFilter is { Length: > 0 } ? record => record.DocumentId == documentIdFilter : null,
        });
        var results = await nearest.ToListAsync();

        // LOG 3: Number of results
        await File.AppendAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
            $"{DateTime.Now}: Found {results.Count} results\n");

        // LOG 4: Retrieved chunks
        foreach (var result in results)
        {
            await File.AppendAllTextAsync(
                Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
                $"{DateTime.Now}: DocumentId = {result.Record.DocumentId}\n");
        }
        Console.WriteLine($"Found {results.Count} results");

        return await nearest.Select(result => result.Record).ToListAsync();
    }


}
