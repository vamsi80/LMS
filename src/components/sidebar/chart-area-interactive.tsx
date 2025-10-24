"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const dummyEnrolmentData = [
  { date: "2023-05-15", enrollments: 12 },
  { date: "2023-05-16", enrollments: 8 },
  { date: "2023-05-17", enrollments: 15 },
  { date: "2023-05-18", enrollments: 23 },
  { date: "2023-05-19", enrollments: 18 },
  { date: "2023-05-20", enrollments: 12 },
  { date: "2023-05-21", enrollments: 8 },
  { date: "2023-05-22", enrollments: 15 },
  { date: "2023-05-23", enrollments: 23 },
  { date: "2023-05-24", enrollments: 18 },
  { date: "2023-05-25", enrollments: 12 },
  { date: "2023-05-26", enrollments: 30 },
  { date: "2023-05-27", enrollments: 15 },
  { date: "2023-05-28", enrollments: 23 },
  { date: "2023-05-29", enrollments: 18 },
  { date: "2023-05-30", enrollments: 29 },
  { date: "2023-05-31", enrollments: 8 },
  { date: "2023-06-01", enrollments: 15 },
  { date: "2023-06-02", enrollments: 23 },
  { date: "2023-06-03", enrollments: 18 },
  { date: "2023-06-04", enrollments: 32 },
  { date: "2023-06-05", enrollments: 12 },
  { date: "2023-06-06", enrollments: 8 },
  { date: "2023-06-07", enrollments: 45 },
  { date: "2023-06-08", enrollments: 23 },
  { date: "2023-06-09", enrollments: 40 },
  { date: "2023-06-10", enrollments: 12 },
  { date: "2023-06-11", enrollments: 21 },
  { date: "2023-06-12", enrollments: 15 },
  { date: "2023-06-13", enrollments: 23 },
  { date: "2023-06-14", enrollments: 55 },
  { date: "2023-06-15", enrollments: 12 },
]

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data: {
    date: string, 
    enrollments: number
  }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {

  const totalEnrollmentsNumber = React.useMemo(()=> data.reduce((acc, curr) => acc + curr.enrollments, 0), [data])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrolements for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days: {totalEnrollmentsNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={'preserveStartEnd'}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={"enrollments"}
              fill="var(--color-enrollments)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
