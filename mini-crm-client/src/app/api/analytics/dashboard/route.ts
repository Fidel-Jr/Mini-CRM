import { apiFetch } from "@/lib/api";

function getValue<T>(
    source: Record<string, unknown>,
    camelKey: string,
    pascalKey: string
): T | undefined {
    return (source[camelKey] ?? source[pascalKey]) as T | undefined;
}

function normalizeMetric(
    value: unknown
) {
    const metric =
        (value ?? {}) as Record<string, unknown>;

    return {
        current:
            getValue<number>(metric, "current", "Current") ?? 0,
        previous:
            getValue<number>(metric, "previous", "Previous") ?? 0
    };
}

function normalizeWonSummary(
    value: unknown
) {
    const summary =
        (value ?? {}) as Record<string, unknown>;

    return {
        won:
            getValue<number>(summary, "won", "Won") ?? 0,
        qualified:
            getValue<number>(summary, "qualified", "Qualified") ?? 0,
        conversionRate:
            getValue<number>(
                summary,
                "conversionRate",
                "ConversionRate"
            ) ?? 0
    };
}

export async function GET(
    request: Request
) {

    const { searchParams } =
        new URL(request.url);

    const range =
        searchParams.get("range") ?? "12m";


    const response = await apiFetch(

        `/api/Analytics/dashboard?range=${encodeURIComponent(range)}`

    );


    const data = await response.json();

    if (!response.ok) {
        return Response.json(
            data,
            {
                status: response.status
            }
        );
    }

    const dashboard =
        data as Record<string, unknown>;

    const leadPipelineTrend =
        getValue<unknown[]>(
            dashboard,
            "leadPipelineTrend",
            "LeadPipelineTrend"
        ) ?? [];

    const normalizedData = {
        range:
            getValue<string>(dashboard, "range", "Range") ?? range,

        pipelineValue:
            normalizeMetric(
                getValue(dashboard, "pipelineValue", "PipelineValue")
            ),

        openOpportunities:
            normalizeMetric(
                getValue(
                    dashboard,
                    "openOpportunities",
                    "OpenOpportunities"
                )
            ),

        averageDealSize:
            normalizeMetric(
                getValue(
                    dashboard,
                    "averageDealSize",
                    "AverageDealSize"
                )
            ),

        winRate:
            normalizeMetric(
                getValue(dashboard, "winRate", "WinRate")
            ),

        leadPipelineTrend: leadPipelineTrend.map((item) => {
            const trendItem =
                item as Record<string, unknown>;

            return {
                label:
                    getValue<string>(trendItem, "label", "Label") ?? "",
                total:
                    getValue<number>(trendItem, "total", "Total") ?? 0
            };
        }),

        wonSummary:
            normalizeWonSummary(
                getValue(dashboard, "wonSummary", "WonSummary")
            )
    };


    return Response.json(
        normalizedData,
        {
            status: response.status
        }
    );

}
