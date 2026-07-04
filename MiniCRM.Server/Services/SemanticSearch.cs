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

    public async Task LoadDocumentsAsync()
    {
        await (_ingestionTask ??= EnsureDocumentsLoadedAsync());
    }

    public async Task IngestDocumentAsync(DirectoryInfo directory, string fileName)
    {
        await vectorCollection.EnsureCollectionExistsAsync();
        await dataIngestor.IngestDataAsync(directory, fileName);

        // Reset so the next search re-checks instead of assuming nothing has changed
        _ingestionTask = null;
    }

    private async Task EnsureDocumentsLoadedAsync()
    {
        await vectorCollection.EnsureCollectionExistsAsync();

        // Check if collection already has data by doing a minimal search
        var dummyEmbedding = await embeddingGenerator.GenerateAsync("test");
        var any = await vectorCollection
            .SearchAsync(dummyEmbedding.Vector, top: 1)
            .AnyAsync();

        if (any)
        {
            return; // Already ingested, skip
        }

        await dataIngestor.IngestDataAsync(ingestionDirectory, "*.*");
    }

    public async Task<IReadOnlyList<IngestedChunk>> SearchAsync(
        string text,
        string? documentIdFilter,
        int maxResults)
    {
        await LoadDocumentsAsync();

        await File.AppendAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
            $"{DateTime.Now}: ===== NEW SEARCH =====\n{DateTime.Now}: Query = {text}\n");

        var embedding = await embeddingGenerator.GenerateAsync(text);

        await File.AppendAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
            $"{DateTime.Now}: Embedding length = {embedding.Vector.Length}\n{DateTime.Now}: Starting vector search...\n");

        try
        {
            var nearest = vectorCollection.SearchAsync(
                embedding.Vector,  // pass the actual float vector, not the raw text
                maxResults,
                new VectorSearchOptions<IngestedChunk>
                {
                    Filter = documentIdFilter is { Length: > 0 }
                        ? record => record.DocumentId == documentIdFilter
                        : null,
                });

            await File.AppendAllTextAsync(
                Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
                $"{DateTime.Now}: SearchAsync() returned. Enumerating...\n");

            var results = await nearest.Select(r => r.Record).ToListAsync();

            await File.AppendAllTextAsync(
                Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
                $"{DateTime.Now}: Found {results.Count} results\n");

            foreach (var result in results)
            {
                await File.AppendAllTextAsync(
                    Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
                    $"{DateTime.Now}: DocumentId = {result.DocumentId}\n");
            }

            return results;
        }
        catch (Exception ex)
        {
            await File.AppendAllTextAsync(
                Path.Combine(AppContext.BaseDirectory, "wwwroot/logs/rag.log"),
                $"{DateTime.Now}: EXCEPTION OCCURRED\n{ex}\n");
            throw;
        }
    }
}