import { useMemo } from "react";
import { FileText, TrendingUp, Award } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import {
  cohortsApi,
  enrollmentsApi,
  resultsApi,
  levelsApi,
  coursesApi,
} from "../../services/api";
import {
  alive,
  byId,
  courseForCohort,
  formatDate,
  percentage,
  resultsForStudent,
} from "../../utils";

const MyGradesPage = () => {
  const { user } = useAuth();

  const cohortsResult = useFetch(() => cohortsApi.list(), []);
  const enrollmentsResult = useFetch(() => enrollmentsApi.list(), []);
  const resultsResult = useFetch(() => resultsApi.list(), []);
  const levelsResult = useFetch(() => levelsApi.list(), []);
  const coursesResult = useFetch(() => coursesApi.list(), []);

  const loading =
    cohortsResult.loading ||
    enrollmentsResult.loading ||
    resultsResult.loading;

  const cohorts = cohortsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const results = resultsResult.data.filter(alive);
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);

  const rows = useMemo(() => {
    const mapped = resultsForStudent(results, enrollments, user?.id).map(
      (result) => {
        const enrollment = byId(enrollments, result.enrollmentId);
        const cohort = enrollment
          ? byId(cohorts, enrollment.cohorttId)
          : undefined;
        const course = cohort
          ? courseForCohort(courses, levels, cohort)
          : undefined;
        const pct = percentage(result.score, result.maxScore);
        return { result, enrollment, cohort, course, pct };
      },
    );
    return mapped.sort((a, b) =>
      String(b.result.createdAt || "").localeCompare(
        String(a.result.createdAt || ""),
      ),
    );
  }, [results, enrollments, cohorts, courses, levels, user]);

  const avg = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.pct, 0) / rows.length)
    : 0;
  const best = rows.length ? Math.max(...rows.map((row) => row.pct)) : 0;
  const passed = rows.filter((row) => row.pct >= 60).length;

  if (loading) return <Spinner label="جارٍ تحميل الدرجات…" />;

  return (
    <div className="space-y-6">
      <PageHeader title="درجاتي" description="جميع النتائج المنشورة لدوراتك." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="عدد النتائج"
          value={rows.length}
          icon={<FileText className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="متوسط الدرجات"
          value={rows.length ? `${avg}%` : "—"}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="lavender"
        />
        <StatCard
          label="أعلى نتيجة"
          value={rows.length ? `${best}%` : "—"}
          icon={<Award className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="اجتياز"
          value={rows.length ? `${passed}/${rows.length}` : "—"}
          icon={<Award className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="لا توجد نتائج منشورة"
          description="ستظهر درجاتك هنا فور نشرها من المدرب."
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ result, cohort, course, pct }) => (
            <Card key={result.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">
                      {course?.name || "—"}
                    </h3>
                    <Badge tone="blue">{result.qrade}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    الدفعة: <span className="ltr">{cohort?.code || "—"}</span>
                    {result.createdAt
                      ? ` · ${formatDate(result.createdAt)}`
                      : ""}
                  </p>
                  {result.notes && (
                    <p className="mt-2 rounded-lg bg-canvas/70 px-3 py-2 text-sm leading-relaxed text-ink/80">
                      {result.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-left">
                    <p className="ltr text-lg font-extrabold text-ink">
                      {result.score}/{result.maxScore}
                    </p>
                    <p className="ltr text-xs text-muted">{pct}%</p>
                  </div>
                  <div className="h-16 w-2 overflow-hidden rounded-full bg-border/70">
                    <div
                      className={`w-full rounded-full ${
                        pct >= 60 ? "bg-success-500" : "bg-error-500"
                      }`}
                      style={{
                        height: `${Math.min(100, Math.max(4, pct))}%`,
                        marginTop: `${100 - Math.min(100, Math.max(4, pct))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGradesPage;
