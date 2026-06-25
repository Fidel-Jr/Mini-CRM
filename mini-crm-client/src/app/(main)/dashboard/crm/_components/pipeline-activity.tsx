"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";

import { Progress } from "@/components/ui/progress";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


const pipelineChartConfig = {

    total: {

        label: "Opportunities",

        color: "var(--chart-2)",

    },

} satisfies ChartConfig;



interface LeadPipelineTrend {

    label:string;

    total:number;

}


interface WonSummary{

    won:number;

    qualified:number;

    conversionRate:number;

}


interface PipelineActivityProps{


    trend:LeadPipelineTrend[];


    summary:WonSummary;


    range:string;


    onRangeChange:(value:string)=>void;


}




export function PipelineActivity({

    trend,

    summary,

    range,

    onRangeChange

}:PipelineActivityProps){



    const totalLeads = trend.reduce(

        (sum,item)=>sum + item.total,

        0

    );



    const rangeLabel = {

        "30d":"last 30 days",

        "quarter":"last quarter",

        "12m":"last 12 months"

    }[range];




    const title = {

        "30d":"Lead Pipeline Flow (30 Days)",

        "quarter":"Lead Pipeline Flow (Quarter)",

        "12m":"Lead Pipeline Flow (12 Months)"

    }[range];



    return(

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">


            <Card className="xl:col-span-12">


                <CardHeader>


                    <CardTitle>

                        {title}

                    </CardTitle>




                    <CardAction>


                        <Select

                            value={range}

                            onValueChange={onRangeChange}

                        >



                            <SelectTrigger

                                size="sm"

                                className="min-w-44"

                            >

                                <SelectValue

                                    placeholder="Select period"

                                />

                            </SelectTrigger>




                            <SelectContent>


                                <SelectGroup>



                                    <SelectItem value="30d">

                                        Last 30 Days

                                    </SelectItem>




                                    <SelectItem value="quarter">

                                        Last Quarter

                                    </SelectItem>




                                    <SelectItem value="12m">

                                        Last 12 Months

                                    </SelectItem>




                                </SelectGroup>


                            </SelectContent>



                        </Select>


                    </CardAction>



                </CardHeader>





                <CardContent>


                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">





                        <ChartContainer

                            config={pipelineChartConfig}

                            className="h-72 w-full lg:col-span-8"

                        >




                            <BarChart

                                data={trend}

                                barSize={40}

                            >



                                <CartesianGrid

                                    vertical={false}

                                />





                                <XAxis

                                    dataKey="label"

                                    tickLine={false}

                                    axisLine={false}

                                />





                                <YAxis hide />






                                <ChartTooltip

                                    content={

                                        <ChartTooltipContent

                                            labelKey="label"

                                            nameKey="total"

                                        />

                                    }

                                />






                                <Bar

                                    dataKey="total"

                                    radius={[8,8,0,0]}

                                    fill="var(--color-total)"

                                />




                            </BarChart>



                        </ChartContainer>






                        <div className="flex flex-col gap-5 rounded-lg p-4 lg:col-span-4">




                            <div>



                                <div className="font-medium text-4xl">


                                    {totalLeads}



                                    <span className="ml-2 text-lg text-muted-foreground">

                                        opportunities

                                    </span>


                                </div>





                                <p className="text-sm text-muted-foreground">


                                    Total active opportunities over the {rangeLabel}.


                                </p>



                            </div>








                            <div className="rounded-lg border p-4">



                                <div className="text-xs uppercase tracking-widest text-muted-foreground">


                                    Conversion Summary


                                </div>






                                <div className="mt-3">



                                    <div className="text-2xl font-semibold">



                                        {summary.won}




                                        <span className="ml-2 text-sm text-muted-foreground">

                                           won deals

                                        </span>



                                    </div>





                                    <p className="text-sm text-muted-foreground">


                                        {summary.conversionRate}% of opportunities became won deals.


                                    </p>



                                </div>








                                <div className="mt-4">



                                    <Progress

                                        value={summary.conversionRate}

                                        className="h-2"

                                    />





                                    <div className="mt-2 flex justify-between text-xs">


                                        <div>


                                            <span className="font-medium">

                                                {summary.won}

                                            </span>

                                            {" "}won


                                        </div>



                                        <div className="text-muted-foreground">


                                            {summary.qualified}

                                            {" "}

                                            opportunities


                                        </div>


                                    </div>



                                </div>




                            </div>




                        </div>



                    </div>



                </CardContent>



            </Card>



        </div>

    );

}
