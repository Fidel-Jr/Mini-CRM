using Microsoft.Extensions.AI;
using Microsoft.Extensions.DataIngestion;
using Microsoft.Extensions.DataIngestion.Chunkers;
using Microsoft.Extensions.VectorData;
using Microsoft.ML.Tokenizers;

namespace MiniCRM.Services.Ingestion;

public class DataIngestor(
    ILogger<DataIngestor> logger,
    ILoggerFactory loggerFactory,
    VectorStore vectorStore,
    IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator)
{
    public async Task IngestDataAsync(DirectoryInfo directory, string searchPattern)
    {
        var logPath = Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/ingest.log");

        await File.AppendAllTextAsync(logPath, $"{DateTime.UtcNow}: IngestDataAsync started\n");

        try
        {
            using var writer = new VectorStoreWriter<string>(vectorStore, dimensionCount: IngestedChunk.VectorDimensions, new()
            {
                CollectionName = IngestedChunk.CollectionName,
                DistanceFunction = IngestedChunk.VectorDistanceFunction,
                IncrementalIngestion = false,
            });

            await File.AppendAllTextAsync(logPath, $"{DateTime.UtcNow}: VectorStoreWriter created\n");

            using var pipeline = new IngestionPipeline<string>(
                reader: new DocumentReader(directory),
                chunker: new SemanticSimilarityChunker(embeddingGenerator, new(TiktokenTokenizer.CreateForModel("gpt-4o-mini"))),
                writer: writer,
                loggerFactory: loggerFactory);

            await File.AppendAllTextAsync(logPath, $"{DateTime.UtcNow}: Pipeline created, starting ProcessAsync\n");

            await foreach (var result in pipeline.ProcessAsync(directory, searchPattern))
            {
                await File.AppendAllTextAsync(logPath,
                    $"{DateTime.UtcNow}: Doc='{result.DocumentId}' Succeeded={result.Succeeded} Error={result.Exception?.Message ?? "none"}\n");

                logger.LogInformation("Completed processing '{id}'. Succeeded: '{succeeded}'.", result.DocumentId, result.Succeeded);
            }

            await File.AppendAllTextAsync(logPath, $"{DateTime.UtcNow}: ProcessAsync completed\n");
        }
        catch (Exception ex)
        {
            await File.AppendAllTextAsync(logPath, $"{DateTime.UtcNow}: EXCEPTION: {ex}\n");
            throw;
        }
    }
}
