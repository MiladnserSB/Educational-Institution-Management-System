import { useState } from "react";
import { Mail, Phone, Pencil, Save, CalendarDays, BookOpen } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Avatar from "../../components/common/Avatar";
import Badge, { accountStatusBadge } from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { usersApi, enrollmentsApi } from "../../services/api";
import { formatDate, roleLabel } from "../../utils";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Active enrollment count for the profile card.
  const enrollmentsResult = useFetch(() => enrollmentsApi.list(), []);
  const enrollmentCount = enrollmentsResult.data.filter(
    (record) => record.studentId === user?.id && record.status === "active",
  ).length;

  if (!user) return null;

  const openEdit = () => {
    setForm({ fullName: user.fullName || "", phone: user.phone || "" });
    setError("");
    setEditOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim()) {
      setError("الاسم الكامل مطلوب.");
      return;
    }
    setSaving(true);
    try {
      await usersApi.update(user.id, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      updateUser({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      toast("success", "تم تحديث الملف الشخصي.");
      setEditOpen(false);
    } catch (err) {
      setError(err.message);
      toast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value, ltr }) => (
    <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className={`truncate text-sm font-medium text-ink ${ltr ? "ltr" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="ملفي الشخصي"
        description="بيانات حسابك والمسار الدراسي."
        action={
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="h-4 w-4" />
            تعديل البيانات
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user.fullName} seed={user.id} size="lg" />
            <h2 className="mt-3 text-lg font-extrabold text-ink">
              {user.fullName}
            </h2>
            <p className="ltr mt-1 text-sm text-muted">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge tone="blue">{roleLabel[user.role] || user.role}</Badge>
              {accountStatusBadge(user.isActive)}
            </div>
            <div className="mt-5 w-full space-y-2 border-t border-border pt-4 text-right">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">التسجيلات النشطة</span>
                <span className="font-semibold text-ink">{enrollmentCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">تاريخ الانضمام</span>
                <span className="text-ink">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card title="البيانات الأساسية">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Mail}
                label="البريد الإلكتروني"
                value={user.email}
                ltr
              />
              <InfoRow
                icon={Phone}
                label="رقم الجوال"
                value={user.phone || "—"}
                ltr
              />
              <InfoRow
                icon={CalendarDays}
                label="تاريخ الميلاد"
                value={formatDate(user.birthDate)}
              />
              <InfoRow
                icon={BookOpen}
                label="المسار الدراسي"
                value={user.study || "—"}
              />
            </div>
          </Card>

          {user.specialization && (
            <Card title="البيانات التدريبية">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted">التخصص</p>
                  <p className="mt-1 font-medium text-ink">
                    {user.specialization}
                  </p>
                </div>
                {user.bio && (
                  <div>
                    <p className="text-xs text-muted">نبذة</p>
                    <p className="mt-1 leading-relaxed text-ink/85">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="تعديل البيانات"
        description="البريد الإلكتروني لا يمكن تغييره."
      >
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input
            label="الاسم الكامل"
            required
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            error={error || undefined}
          />
          <Input
            label="رقم الجوال"
            type="tel"
            placeholder="05xxxxxxxx"
            className="ltr"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              حفظ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
