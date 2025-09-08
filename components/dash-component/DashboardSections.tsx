import { MetricCard } from "@/components/dash-component/MetricCard";
import { RecentTable } from "@/components/dash-component/RecentTable";
import { RiskPieChart } from "@/components/dash-component/RiskPieChart";
import { TrendChart } from "@/components/dash-component/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface DashboardSectionsProps {
  data: any;
}

export function DashboardSections({ data }: DashboardSectionsProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="contacts">
        <AccordionTrigger>Contacts</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard title="Total Contacts" value={data.contacts.total} />
            <MetricCard
              title="New Contacts"
              value={data.contacts.new}
              color="text-blue-500"
            />
            <MetricCard
              title="In Progress"
              value={data.contacts.in_progress}
              color="text-yellow-500"
            />
            <MetricCard
              title="Resolved"
              value={data.contacts.resolved}
              color="text-green-500"
            />
            <MetricCard
              title="Today"
              value={data.contacts.received_today}
              color="text-teal-500"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="needs_action">
        <AccordionTrigger>Needs Action</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              title="Pending Review"
              value={data.needs_action.pending_review}
              color="text-yellow-500"
            />
            <MetricCard
              title="Unresolved Contacts"
              value={data.needs_action.unresolved_contacts}
              color="text-orange-500"
            />
            <MetricCard
              title="Low Score Approved"
              value={data.needs_action.low_score_approved}
              color="text-red-500"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="quality">
        <AccordionTrigger>Quality Insights</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Recent Avg Score"
              value={data.quality.recent_average_score}
              color="text-blue-500"
            />
            <MetricCard
              title="Rejection Rate"
              value={`${data.quality.rejection_rate}%`}
              color="text-red-500"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="system">
        <AccordionTrigger>System</AccordionTrigger>
        <AccordionContent>
          <MetricCard
            title="Active Questions"
            value={data.system.active_questions}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="score_distribution">
        <AccordionTrigger>Score Distribution</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <RecentTable
                title="Score Distribution"
                items={data.score_breakdown}
                columns={["score_range", "count", "percentage"]}
              />
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
