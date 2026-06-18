using Microsoft.Extensions.AI;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace MiniCRM.Services;

public class ChatService(
    IChatClient chatClient,
    SemanticSearch search)
{
    private const string SystemPrompt = """
        You are an assistant who answers questions about information you retrieve.
        Do not answer questions about anything else.
        Use only simple markdown to format your responses.

        Use the LoadDocuments tool to prepare for searches before answering any questions.

        Use the Search tool to find relevant information. When you do this, end your
        reply with source in the special format:

        📄 Source: source/file name

        Always include the source in your response if there are results.

        The quote must be max 5 words, taken word-for-word from the search result, and is the basis for why the source is relevant.
        Don't refer to the presence of sources; just emit these tags right at the end, with no surrounding text.
        """;

    public async IAsyncEnumerable<string> StreamResponseAsync(
    string message,
    [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var chatOptions = new ChatOptions();
        chatOptions.Tools = [
            AIFunctionFactory.Create(search.LoadDocumentsAsync),
        AIFunctionFactory.Create(search.SearchAsync)
        ];

        var messages = new List<ChatMessage>
    {
        new(ChatRole.System, SystemPrompt),
        new(ChatRole.User, message)
    };

        await foreach (var update in chatClient.GetStreamingResponseAsync(
            messages,
            chatOptions,
            cancellationToken))
        {
            if (!string.IsNullOrEmpty(update.Text))
            {
                yield return update.Text;
            }
        }
    }


}