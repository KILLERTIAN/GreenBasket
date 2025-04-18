"use client";
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
  light: "",
  dark: ".dark"
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    (<ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>)
  );
}

const ChartStyle = ({
  id,
  config
}) => {
  const colorConfig = Object.entries(config || {}).filter(([, config]) => config?.theme || config?.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    (<style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
.map(([key, itemConfig]) => {
const color =
  itemConfig.theme?.[theme] ||
  itemConfig.color
return color ? `  --color-${key}: ${color};` : null
})
.join("\n")}
}
`)
          .join("\n"),
      }} />)
  );
}

// Main Chart component that's used in the profile page
function Chart({ type, data, options = {}, className, ...props }) {
  const ChartComponent = getChartComponent(type)
  
  if (!ChartComponent) {
    console.error(`Chart type "${type}" is not supported.`)
    return null
  }
  
  return (
    <ChartContainer className={className} config={{}}>
      <ChartComponent data={data} {...options} {...props}>
        {type === 'pie' || type === 'donut' ? (
          <RechartsPrimitive.Pie dataKey="value" />
        ) : (
          <>
            <RechartsPrimitive.XAxis dataKey={data?.labels ? 'name' : 'x'} />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
            <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
            <RechartsPrimitive.Legend />
            {data?.datasets?.map((dataset, index) => {
              const DatasetComponent = getDatasetComponent(type)
              return DatasetComponent ? (
                <DatasetComponent 
                  key={index}
                  type={type}
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  fill={dataset.backgroundColor || dataset.borderColor}
                  data={dataset.data.map((value, i) => ({
                    name: data.labels?.[i] || i,
                    [dataset.label]: value
                  }))}
                />
              ) : null
            })}
          </>
        )}
      </ChartComponent>
    </ChartContainer>
  )
}

// Helper function to get the right Recharts component based on chart type
function getChartComponent(type) {
  switch (type?.toLowerCase()) {
    case 'line':
      return RechartsPrimitive.LineChart
    case 'bar':
      return RechartsPrimitive.BarChart
    case 'area':
      return RechartsPrimitive.AreaChart
    case 'pie':
    case 'donut':
      return RechartsPrimitive.PieChart
    case 'radar':
      return RechartsPrimitive.RadarChart
    default:
      return null
  }
}

// Helper function to get the right dataset component based on chart type
function getDatasetComponent(type) {
  switch (type?.toLowerCase()) {
    case 'line':
      return RechartsPrimitive.Line
    case 'bar':
      return RechartsPrimitive.Bar
    case 'area':
      return RechartsPrimitive.Area
    default:
      return null
  }
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        (<div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>)
      );
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    (<div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            (<div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}>
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent":
                            indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed",
                        })}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor
                          }
                        } />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}>
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>)
          );
        })}
      </div>
    </div>)
  );
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    (<div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          (<div
            key={item.value}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              !hideIcon && (
                <div
                  className={cn("h-2.5 w-2.5 rounded-[2px]")}
                  style={{ backgroundColor: item.color }} />
              )
            )}
            <span className="whitespace-nowrap text-muted-foreground">
              {itemConfig?.label || item.value}
            </span>
          </div>)
        );
      })}
    </div>)
  );
}

function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {
  return (
    config?.[key] ||
    config?.[payload?.id] ||
    (payload?.dataKey && config?.[payload.dataKey]) ||
    (payload?.name && config?.[payload.name]) ||
    {}
  )
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Chart
}
