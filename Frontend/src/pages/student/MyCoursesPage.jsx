import { useMemo, useState } from "react";
import { BookOpen, Compass, CalendarDays, Users } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import Avatar from "../../components/common/Avatar";
import Badge, {
  cohortStatusBadge,
  sessionStatusBadge,
} from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import {
  cohortsApi,
  levelsApi,
  coursesApi,
  usersApi,
  enrollmentsApi,
  sessionsApi,
} from "../../services/api";
import {
  alive,
  byId,
  enrollmentsByStudent,
  formatDate,
  levelsByCourse,
  sessionsByCohort,
} from "../../utils";

const MyCoursesPage = () => {
  const { user } = useAuth();

  const cohortsResult = useFetch(() => cohortsApi.list(), []);
  const levelsResult = useFetch(() => levelsApi.list(), []);
  const coursesResult = useFetch(() => coursesApi.list(), []);
  const usersResult = useFetch(() => usersApi.list(), []);
  const enrollmentsResult = useFetch(() => enrollmentsApi.list(), []);
  const sessionsResult = useFetch(() => sessionsApi.list(), []);

  const loading =
    cohortsResult.loading ||
    levelsResult.loading ||
    coursesResult.loading ||
    enrollmentsResult.loading;

  const cohorts = cohortsResult.data.filter(alive);
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);
  const allUsers = usersResult.data;
  const enrollments = enrollmentsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);

  const [tab, setTab] = useState("learning");
  const [detailCourse, setDetailCourse] = useState(null);

  const myEnrollments = useMemo(
    () => enrollmentsByStudent(enrollments, user?.id),
    [enrollments, user],
  );
  const activeEnrollments = myEnrollments.filter(
    (enrollment) => enrollment.status === "active",
  );

  const approvedCourses = useMemo(
    () => courses.filter((course) => course.isActive && !course.deletedAt),
    [courses],
  );

  const tabClass = (active) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? "bg-brand-blue text-white" : "text-muted hover:text-ink"
    }`;

  const CourseCardBody = ({ course, enrollment }) => {
    const courseLevels = levelsByCourse(levels, course.id);
    const myLevel = enrollment
      ? levels.find(
          (level) =>
            level.id ===
            byId(cohorts, enrollment.cohorttId)?.levelId,
        )
      : undefined;
    const cohort = enrollment
      ? byId(cohorts, enrollment.cohorttId)
      : undefined;
    const teacher = cohort ? byId(allUsers, cohort.teacherId) : undefined;

    return (
      <>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <BookOpen className="h-5 w-5" />
          </div>
          <Badge tone="blue">{courseLevels.length} مستوى</Badge>
        </div>
        <h3 className="mt-3 text-base font-bold text-ink">{course.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {course.description}
        </p>

        {enrollment ? (
          <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted">
            <div className="flex items-center justify-between">
              <span>الدفعة</span>
              <span className="ltr font-medium text-ink">
                {cohort?.code || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>المستوى</span>
              <span className="font-medium text-ink">
                {myLevel?.title || "—"}
              </span>
            </div>
            {teacher && (
              <div className="flex items-center justify-between">
                <span>المدرب</span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Avatar
                    name={teacher.fullName}
                    seed={teacher.id}
                    size="sm"
                    className="h-5 w-5 text-[9px]"
                  />
                  {teacher.fullName}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
            للتسجيل تواصل مع الإدارة
          </p>
        )}
      </>
    );
  };

  if (loading) return <Spinner label="جارٍ تحميل الدورات…" />;

  return (
    <div className="space-y-6">
      <PageHeader title="دوراتي" description="دوراتك المسجّل فيها والدورات المتاحة" />

      <div className="w-fit rounded-xl border border-border bg-white p-1">
        <button onClick={() => setTab("learning")} className={tabClass(tab === "learning")}>
          <BookOpen className="h-4 w-4" /> دوراتي
        </button>
        <button onClick={() => setTab("explore")} className={tabClass(tab === "explore")}>
          <Compass className="h-4 w-4" /> استكشاف الدورات
        </button>
      </div>

      {tab === "learning" ? (
        activeEnrollments.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-7 w-7" />}
            title="لا توجد تسجيلات نشطة"
            description="انتقل إلى تبويب استكشاف الدورات لتعرف على البرامج المتاحة."
            action={
              <Button onClick={() => setTab("explore")}>
                <Compass className="h-4 w-4" />
                استكشاف الدورات
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeEnrollments.map((enrollment) => {
              const cohort = byId(cohorts, enrollment.cohorttId);
              const level = cohort ? byId(levels, cohort.levelId) : undefined;
              const course = level ? byId(courses, level.courseId) : undefined;
              if (!course) return null;
              return (
                <Card
                  key={enrollment.id}
                  className="transition hover:shadow-cardLg hover:border-muted/30"
                >
                  <CourseCardBody course={course} enrollment={enrollment} />
                </Card>
              );
            })}
          </div>
        )
      ) : approvedCourses.length === 0 ? (
        <EmptyState
          icon={<Compass className="h-7 w-7" />}
          title="لا توجد دورات متاحة حالياً"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approvedCourses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer transition hover:shadow-cardLg hover:border-muted/30"
              onClick={() => setDetailCourse(course)}
            >
              <CourseCardBody course={course} enrollment={null} />
            </Card>
          ))}
        </div>
      )}

      {/* Course detail */}
      <Modal
        open={Boolean(detailCourse)}
        onClose={() => setDetailCourse(null)}
        title={detailCourse?.name || ""}
        description={detailCourse?.description || ""}
        size="lg"
      >
        {detailCourse && (
          <CourseDetailBody
            course={detailCourse}
            levels={levels}
            cohorts={cohorts}
            sessions={sessions}
            users={allUsers}
          />
        )}
      </Modal>
    </div>
  );
};

const CourseDetailBody = ({ course, levels, cohorts, sessions, users }) => {
  const courseLevels = levelsByCourse(levels, course.id);
  const levelIds = new Set(courseLevels.map((level) => level.id));
  const courseCohorts = cohorts.filter((cohort) =>
    levelIds.has(cohort.levelId),
  );
  const cohortIds = new Set(courseCohorts.map((cohort) => cohort.id));
  const courseSessions = sessions.filter((session) =>
    cohortIds.has(session.cohortId),
  );
  const upcoming = courseSessions
    .filter((session) => session.status === "scheduled")
    .sort((a, b) =>
      String(a.sessionDate || "").localeCompare(String(b.sessionDate || "")),
    )
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Users className="h-4 w-4 text-muted" /> المستويات
        </h4>
        {courseLevels.length === 0 ? (
          <p className="text-sm text-muted">لا توجد مستويات معلنة.</p>
        ) : (
          <div className="space-y-1.5">
            {courseLevels.map((level, index) => (
              <div
                key={level.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-lavender/15 text-xs font-bold text-[#8b4fb8]">
                    {index + 1}
                  </span>
                  {level.title}
                </span>
                <span className="text-xs text-muted">
                  {cohorts.filter((cohort) => cohort.levelId === level.id).length} دفعة
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <CalendarDays className="h-4 w-4 text-muted" /> الدفعات والجلسات
        </h4>
        {courseCohorts.length === 0 ? (
          <p className="text-sm text-muted">لا توجد دفعات معلنة بعد.</p>
        ) : (
          <div className="space-y-2">
            {courseCohorts.map((cohort) => {
              const teacher = byId(users, cohort.teacherId);
              const count = courseSessions.filter(
                (session) => session.cohortId === cohort.id,
              ).length;
              return (
                <div
                  key={cohort.id}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="ltr text-sm font-semibold text-ink">
                      {cohort.code}
                    </span>
                    {cohortStatusBadge(cohort.status)}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span>
                      {formatDate(cohort.startDate)} —{" "}
                      {formatDate(cohort.endDate)}
                    </span>
                    <span>السعة: {cohort.capacity ?? "—"}</span>
                    <span>{count} جلسة</span>
                    {teacher && <span>المدرب: {teacher.fullName}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-bold text-ink">جلسات قادمة</h4>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">لا توجد جلسات مجدولة حالياً.</p>
        ) : (
          <div className="space-y-1.5">
            {upcoming.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <span className="text-ink">
                  جلسة {session.sessionNumber} — {session.topic}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {formatDate(session.sessionDate)}
                  </span>
                  {sessionStatusBadge(session.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
