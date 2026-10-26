import { useEffect, useState } from "react";
import type { User } from "../types";
import { getProfile, updateProfile } from "../api/userApi";
import { handleError } from "../helpers/handleError";
import { ProfileCard } from "../components/ProfileCard";

type Props = {
  token: string;
};

export function ProfilePage({ token }: Props) {
  const [profile, setProfile] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getProfile(token)
      .then((loadedProfile) => {
        if (!active) return;
        setProfile(loadedProfile);
        setNickname(loadedProfile.nickname);
        setBio(loadedProfile.bio);
      })
      .catch((loadError: unknown) => {
        if (active) setError(handleError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [token]);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!nickname.trim()) {
      setError("Никнейм не может быть пустым.");
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await updateProfile(token, {
        nickname: nickname.trim(),
        bio: bio.trim()
      });
      setProfile(updatedProfile);
      setNickname(updatedProfile.nickname);
      setBio(updatedProfile.bio);
      setSuccess("Профиль успешно сохранён.");
    } catch (saveError: unknown) {
      setError(handleError(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">АККАУНТ</span>
          <h1>Мой профиль</h1>
          <p className="muted-text">Информация о вас и настройки отображаемого имени.</p>
        </div>
        <div className="heading-icon" aria-hidden="true">◎</div>
      </div>

      {loading && <div className="loading-state"><span className="spinner" /> Загружаем профиль…</div>}
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {success && <p className="notice notice-success" role="status">{success}</p>}

      {profile && <ProfileCard profile={profile} />}

      <section className="editor-card card-surface">
        <div className="card-heading">
          <div>
            <h2>Редактирование</h2>
            <p className="muted-text">Эти данные увидят другие участники чата.</p>
          </div>
          <span className="edit-badge">Настройки</span>
        </div>

        <div className="form-stack">
          <label htmlFor="nickname">Никнейм</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Например, Alex"
            maxLength={40}
            disabled={loading || !profile || saving}
          />

          <label htmlFor="bio">О себе</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Пара слов о себе…"
            rows={4}
            maxLength={300}
            disabled={loading || !profile || saving}
          />

          <div className="form-footer">
            <span className="muted-text">Телефон изменить нельзя.</span>
            <button className="button button-primary" type="button" onClick={() => void handleSave()} disabled={loading || !profile || saving}>
              {saving ? "Сохраняем…" : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default ProfilePage;
