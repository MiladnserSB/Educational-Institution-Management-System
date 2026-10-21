import { useMemo } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import { attendanceBadge } from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import {
  cohortsApi,
  sessionsApi,
  enrollmentsApi,
  attendancesApi,
  levelsApi,
  coursesApi,
} from "../../services/api";
import {
  alive,
  attendanceForStudent,
  courseForCohort,
  formatDate,
  percentage,
  sessionTitle,
} from "../../utils";

const MyAttendancePage = () => {
  const { user } = useAuth();

  const cohortsResult = useFetch(() => cohortsApi.list(), []);
  const sessionsResult = useFetch(() => sessionsApi.list(), []);
  const enrollmentsResult = useFetch(() => enrollmentsApi.list(), []);
  const attendanceResult = useFetch(() => attendancesApi.list(), []);
  const levelsResult = useFetch(() => levelsApi.list(), []);
  const coursesResult = useFetch(() => coursesApi.list(), []);

  const loading =
    cohortsResult.loading ||
    sessionsResult.loading ||
    enrollmentsResult.loading ||
    attendanceResult.loading;

  const cohorts = cohortsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const attendance = attendanceResult.data;
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);

  const myAttendance = useMemo(
    () => attendanceForStudent(attendance, enrollments, user?.id),
    [attendance, enrollments, user],
  );

  const rows = useMemo(
    () =>
      myAttendance
        .map((record) => {
          const session = bySessionId(sessions, record.SessionId);
          const cohort = session
            ? cohorts.find((item) => item.id === session.cohortId)
            : undefined;
          const course = cohort
            ? courseForCohort(courses, levels, cohort)
            : undefined;
          return { record, session, course };
        })
        .sort((a, b) =>
          String(b.session?.sessionDate || b.record.createdAt || "").localeCompare(
            String(a.session?.sessionDate || a.record.createdAt || ""),
          ),
        ),
    [myAttendance, sessions, cohorts, courses, levels],
  );

  const counts = {
    present: myAttendance.filter((r) => r.status === "present").length,
    late: myAttendance.filter((r) => r.status === "late").length,
    absent: myAttendance.filter((r) => r.status === "absent").length,
    excused: myAttendance.filter((r) => r.status === "excused").length,
  };
  const attended = counts.present + counts.late + counts.excused;
  const rate = myAttendance.length
    ? percentage(attended, myAttendance.length)
    : 0;

  if (loading) return <Spinner label="جارٍ تحميل سجل الحضور…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="حضوري"
        description="سجل حضورك في جميع جلسات دوراتك."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="نسبة الحضور"
          value={myAttendance.length ? `${rate}%` : "—"}
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="success"
          hint={`${attended} من ${myAttendance.length}`}
        />
        <StatCard
          label="حاضر"
          value={counts.present}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="متأخر / بعذر"
          value={counts.late + counts.excused}
          icon={<Clock className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="غائب"
          value={counts.absent}
          icon={<XCircle className="h-5 w-5" />}
          accent="warning"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="لا يوجد سجل حضور"
          description="لم تُسجَّل أي حضور بعد — سيظهر السجل بعد أول جلسة."
        />
      ) : (
        <Card title="سجل الحضور" padding="none">
          <div className="divide-y divide-border/60">
            {rows.map(({ record, session, course }) => (
              <div
                key={record.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {session ? sessionTitle(session) : "جلسة محذوفة"}
                  </p>
                  <p className="text-xs text-muted">
                    {course?.name || "—"}
                    {session
                      ? ` · ${formatDate(session.sessionDate)}`
                      : record.createdAt
                        ? ` · ${formatDate(record.createdAt)}`
                        : ""}
                  </p>
                </div>
                {attendanceBadge(record.status)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const bySessionId = (sessions, sessionId) =>
  sessionId == null
    ? undefined
    : sessions.find((session) => session.id === sessionId);

export default MyAttendancePage;
