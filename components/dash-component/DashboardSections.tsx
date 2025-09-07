import { AdminAnalytics } from "@/types/analytics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MetricCard } from "@/components/dash-component/MetricCard";
import { RecentTable } from "@/components/dash-component/RecentTable";
import { RiskPieChart } from "@/components/dash-component/RiskPieChart";
import { TrendChart } from "@/components/dash-component/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSectionsProps {
  data: AdminAnalytics;
}

export function DashboardSections({ data }: DashboardSectionsProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="submissions">
        <AccordionTrigger>Submissions</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Total Submissions"
              value={data.submissions.total}
              color="text-blue-500"
              description="All submissions received"
            />
            <MetricCard
              title="Pending"
              value={data.submissions.pending}
              color="text-yellow-500"
              description="Awaiting review"
            />
            <MetricCard
              title="Approved"
              value={data.submissions.approved}
              color="text-green-500"
              description="Approved submissions"
            />
            <MetricCard
              title="Rejected"
              value={data.submissions.rejected}
              color="text-red-500"
              description="Rejected submissions"
            />
            <MetricCard
              title="Today"
              value={data.submissions.today}
              color="text-teal-500"
              description="Submissions received today"
            />
            <MetricCard
              title="Avg Score"
              value={data.submissions.avg_score ?? "N/A"}
              description="Average submission score"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="workload">
        <AccordionTrigger>Workload</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Pending Review"
              value={data.workload.pending_review}
              color="text-yellow-500"
              description="Submissions awaiting review"
            />
            <MetricCard
              title="Contacts Needing Response"
              value={data.workload.contacts_needing_response}
              color="text-orange-500"
              description="Unresolved contacts"
            />
            <MetricCard
              title="Low Score Approved"
              value={data.workload.low_score_approved}
              color="text-red-500"
              description="Approved with score < 60"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="quality">
        <AccordionTrigger>Quality Insights</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <MetricCard
                title="Avg Score (30 Days)"
                value={data.quality.score_avg_last_30_days ?? "N/A"}
                color="text-blue-500"
                description="Recent score trend"
              />
              <MetricCard
                title="Rejection Rate"
                value={`${data.quality.rejection_rate_percent}%`}
                color="text-red-500"
                description="Percentage of submissions rejected"
              />
            </div>
            <div className="w-full overflow-x-auto">
              <RiskPieChart distribution={data.quality.risk_distribution} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="contacts">
        <AccordionTrigger>Contacts</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Total Contacts"
              value={data.contacts.total}
              description="All contacts received"
            />
            <MetricCard
              title="New Contacts"
              value={data.contacts.new}
              color="text-blue-500"
              description="Newly received contacts"
            />
            <MetricCard
              title="In Progress"
              value={data.contacts.in_progress}
              color="text-yellow-500"
              description="Contacts needing response"
            />
            <MetricCard
              title="Resolved"
              value={data.contacts.resolved}
              color="text-green-500"
              description="Resolved contacts"
            />
            <MetricCard
              title="Today"
              value={data.contacts.today}
              color="text-teal-500"
              description="Contacts received today"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="questions">
        <AccordionTrigger>Questions</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title="Total Questions"
              value={data.questions.total_questions}
              description="Total active questions"
            />
            <MetricCard
              title="Avg Answers per Submission"
              value={data.questions.avg_answers_per_submission}
              description="Average answers per submission"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="activity_trend">
        <AccordionTrigger>Activity Trend (Last 30 Days)</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                <TrendChart data={data.activity_trend} />
              </div>
            </CardContent>
          </Card>
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
              <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                <RecentTable
                  title="Score Distribution"
                  items={data.score_distribution}
                  columns={["range", "count", "percentage"]}
                />
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="recent_activity">
        <AccordionTrigger>Recent Activity</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Recent High-Risk Submissions
              </h3>
              <div className="w-full overflow-x-auto">
                <RecentTable
                  title="High Risk"
                  items={data.recent_activity.recent_high_risk}
                  columns={["id", "team_name", "score"]}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Recent Unresolved Contacts
              </h3>
              <div className="w-full overflow-x-auto">
                <RecentTable
                  title="Recent Contacts"
                  items={data.recent_activity.recent_contacts}
                  columns={["id", "name", "created_at"]}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Recent Pending Submissions
              </h3>
              <div className="w-full overflow-x-auto">
                <RecentTable
                  title="Pending"
                  items={data.recent_activity.recent_pending}
                  columns={["id", "team_name", "created_at"]}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
