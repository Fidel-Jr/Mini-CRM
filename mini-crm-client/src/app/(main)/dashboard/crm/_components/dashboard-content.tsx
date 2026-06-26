"use client";

import { useQuery } from "@tanstack/react-query";

import { KpiCards } from "../_components/kpi-cards";
import { OpportunitiesSection } from "../_components/opportunities-section";
import { PipelineActivity } from "../_components/pipeline-activity";
import { TaskReminders } from "../_components/task-reminders";
import { useState } from "react";


export default function Page() {

    const [range, setRange] =
    useState("12m");

    const { data, isLoading } = useQuery({

        queryKey: ['dashboard', range],

        queryFn: async () => {

            const response = await fetch(

                `/api/analytics/dashboard?range=${range}`
            );

            if (!response.ok)
                throw new Error("Failed");

            return response.json();
        }

    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (

        <div className="flex flex-col gap-4 md:gap-6">
            <KpiCards metrics={data} />
            <PipelineActivity
                trend={data.leadPipelineTrend}
                summary={data.wonSummary}
                range={range}
                onRangeChange={setRange}
            />
            
            {/* <TaskReminders /> */}
            <OpportunitiesSection />
        </div>

    );
}