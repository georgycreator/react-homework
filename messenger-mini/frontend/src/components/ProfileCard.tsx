import type { User } from "../types";

type Props = {
  profile: User | null;
};

export function ProfileCard({ profile }: Props) {
  if (!profile) return null;

  const initials = profile.nickname.trim().slice(0, 1).toLocaleUpperCase("ru-RU") || "?";

  return (
    <section className="profile-summary card-surface" aria-label="Данные профиля">
      <div className="profile-avatar" aria-hidden="true">{initials}</div>
      <div className="profile-summary-text">
        <span className="eyebrow">ВАШ АККАУНТ</span>
        <h3>{profile.nickname}</h3>
        <p className="profile-phone">{profile.phone}</p>
        <p className="profile-bio">{profile.bio || "Описание пока не добавлено."}</p>
      </div>
    </section>
  );
}

export default ProfileCard;
