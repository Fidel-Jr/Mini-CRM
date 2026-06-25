"use client";

import {
    ArrowUpRight,
    TrendingDown,
    TrendingUp
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";


type Metric = {
    current: number;
    previous: number;
};


export interface DashboardMetrics {
    pipelineValue: Metric;
    openOpportunities: Metric;
    averageDealSize: Metric;
    winRate: Metric;
}


interface KpiCardsProps {
    metrics?: DashboardMetrics;
}


function getPercentage(
    current: number,
    previous: number
) {
    if (previous === 0) return 100;

    return Math.round(
        ((current - previous) / previous) * 100
    );
}


function getBadgeClasses(positive: boolean) {
    return positive
        ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
        : "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300";
}


function MetricBadge({
    current,
    previous
}: Metric) {

    const percentage = getPercentage(
        current,
        previous
    );

    const positive =
        current >= previous;

    return (

        <Badge
            variant="outline"
            className={getBadgeClasses(positive)}
        >

            {
                positive
                    ? <TrendingUp />
                    : <TrendingDown />
            }

            {percentage > 0 ? "+" : ""}
            {percentage}%

        </Badge>

    );
}


export function KpiCards({
    metrics
}: KpiCardsProps) {


    if (!metrics) return null;


    return (

        <section className="space-y-5">


            <div className="space-y-1">

                <h2 className="text-3xl tracking-tight">
                    Pipeline Overview
                </h2>

                <p className="text-sm text-muted-foreground">

                    Keep tabs on lead quality,
                    open opportunities,
                    and conversion rates
                    across the current sales cycle.

                </p>

            </div>



            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


                {/* Pipeline Value */}

                <Card>

                    <CardHeader>

                        <CardDescription>
                            Pipeline Value
                        </CardDescription>

                        <CardAction>
                            <ArrowUpRight className="size-4" />
                        </CardAction>

                    </CardHeader>


                    <CardContent className="space-y-2">


                        <div className="flex items-center gap-3">

                            <span className="text-3xl tracking-tight">

                                ₱{
                                    metrics.pipelineValue.current
                                        .toLocaleString()
                                }

                            </span>

                            <MetricBadge
                                current={metrics.pipelineValue.current}
                                previous={metrics.pipelineValue.previous}
                            />

                        </div>


                        <p className="text-sm">

                            <span className="font-medium">

                                ₱{
                                    metrics.pipelineValue.previous
                                        .toLocaleString()
                                }

                            </span>

                            <span className="text-muted-foreground">

                                {" "}last month

                            </span>

                        </p>

                    </CardContent>

                </Card>



                {/* Open Opportunities */}

                <Card>

                    <CardHeader>

                        <CardDescription>

                            Open Opportunities

                        </CardDescription>

                        <CardAction>

                            <ArrowUpRight className="size-4" />

                        </CardAction>

                    </CardHeader>



                    <CardContent className="space-y-2">

                        <div className="flex items-center gap-3">


                            <span className="text-3xl tracking-tight">

                                {
                                    metrics.openOpportunities.current
                                }

                            </span>


                            <MetricBadge

                                current={
                                    metrics.openOpportunities.current
                                }

                                previous={
                                    metrics.openOpportunities.previous
                                }

                            />

                        </div>



                        <p className="text-sm">

                            <span className="font-medium">

                                {
                                    metrics.openOpportunities.previous
                                }

                            </span>

                            <span className="text-muted-foreground">

                                {" "}last month

                            </span>

                        </p>

                    </CardContent>

                </Card>




                {/* Average Deal Size */}

                <Card>

                    <CardHeader>

                        <CardDescription>

                            Average Deal Size

                        </CardDescription>

                        <CardAction>

                            <ArrowUpRight className="size-4" />

                        </CardAction>

                    </CardHeader>



                    <CardContent className="space-y-2">

                        <div className="flex items-center gap-3">

                            <span className="text-3xl tracking-tight">

                                ₱{
                                    metrics.averageDealSize.current
                                        .toLocaleString()
                                }

                            </span>


                            <MetricBadge

                                current={
                                    metrics.averageDealSize.current
                                }

                                previous={
                                    metrics.averageDealSize.previous
                                }

                            />

                        </div>



                        <p className="text-sm">

                            <span className="font-medium">

                                ₱{
                                    metrics.averageDealSize.previous
                                        .toLocaleString()
                                }

                            </span>


                            <span className="text-muted-foreground">

                                {" "}last month

                            </span>

                        </p>

                    </CardContent>

                </Card>





                {/* Win Rate */}

                <Card>

                    <CardHeader>

                        <CardDescription>

                            Win Rate

                        </CardDescription>

                        <CardAction>

                            <ArrowUpRight className="size-4" />

                        </CardAction>

                    </CardHeader>



                    <CardContent className="space-y-2">


                        <div className="flex items-center gap-3">


                            <span className="text-3xl tracking-tight">

                                {metrics.winRate.current}%

                            </span>



                            <MetricBadge

                                current={
                                    metrics.winRate.current
                                }

                                previous={
                                    metrics.winRate.previous
                                }

                            />

                        </div>



                        <p className="text-sm">

                            <span className="font-medium">

                                {metrics.winRate.previous}%

                            </span>

                            <span className="text-muted-foreground">

                                {" "}last month

                            </span>

                        </p>

                    </CardContent>

                </Card>


            </div>


        </section>
    );
}