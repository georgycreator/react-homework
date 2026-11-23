import styled from 'styled-components';
import { float } from '../../styles/animations';

export const AppShell = styled.div`
  min-height: 100vh;
  overflow: clip;
  background: ${({ theme }) => theme.colors.page};
`;

export const Container = styled.div`
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;

  @media (max-width: 600px) {
    width: min(100% - 32px, 1180px);
  }
`;

export const HeaderBar = styled.header`
  position: sticky;
  z-index: 30;
  top: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.page};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.page} 88%, ${({ theme }) => theme.colors.transparent});
  backdrop-filter: blur(18px);
`;

export const HeaderInner = styled(Container)`
  display: flex;
  min-height: 78px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 420px) {
    min-height: 68px;
    gap: 8px;
  }
`;

export const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  min-width: max-content;

  @media (max-width: 420px) {
    gap: 7px;
  }
`;

export const BrandMark = styled.span`
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.08em;

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    font-size: 16px;
  }
`;

export const BrandText = styled.span`
  display: grid;
  gap: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 1.05;

  small {
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.15em;
  }

  @media (max-width: 420px) {
    font-size: 13px;

    small {
      display: none;
    }
  }
`;

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;

  a {
    transition: color ${({ theme }) => theme.motion.fast};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 740px) {
    display: none;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;

  @media (max-width: 420px) {
    gap: 6px;
  }
`;

export const Hero = styled.section`
  padding: 54px 0 70px;

  @media (max-width: 700px) {
    padding: 32px 0 46px;
  }
`;

export const HeroGrid = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  align-items: center;
  gap: clamp(28px, 5vw, 72px);

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;

  &::before {
    width: 22px;
    height: 1px;
    background: currentColor;
    content: '';
  }
`;

export const HeroTitle = styled.h1`
  max-width: 650px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(42px, 6vw, 76px);
  font-weight: 900;
  letter-spacing: -0.075em;
  line-height: 0.99;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HeroDescription = styled.p`
  max-width: 490px;
  margin: 22px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.8;
`;

export const HeroActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
`;

export const HeroNote = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 34px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;

  strong {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 800;
  }
`;

export const HeroVisual = styled.div`
  position: relative;
  display: grid;
  min-height: 430px;
  place-items: center;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.heroStart}, ${({ theme }) => theme.colors.heroEnd});
  box-shadow: ${({ theme }) => theme.shadows.soft};

  @media (max-width: 850px) {
    min-height: 350px;
  }
`;

export const HeroOrb = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${({ $position }) => ($position === 'left' ? 'left: -58px; bottom: -68px;' : 'right: -48px; top: -46px;')}
  width: 230px;
  height: 230px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  opacity: 0.13;
`;

export const HeroPoster = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  width: min(76%, 340px);
  min-height: 330px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 34px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transform: rotate(-5deg);
  animation: ${float} 6s ease-in-out infinite;

  @media (max-width: 850px) {
    min-height: 270px;
  }
`;

export const PosterLabel = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.18em;
`;

export const PosterArt = styled.div`
  display: grid;
  width: 194px;
  height: 194px;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.productAccents.leaf.background};
  font-size: 112px;
  filter: drop-shadow(0 16px 14px ${({ theme }) => theme.colors.shadow});

  @media (max-width: 850px) {
    width: 160px;
    height: 160px;
    font-size: 90px;
  }
`;

export const PosterFooter = styled.div`
  position: absolute;
  right: 24px;
  bottom: 23px;
  left: 24px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 850;

  small {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 9px;
    font-weight: 700;
  }
`;

export const FloatingTag = styled.div<{ $placement: 'top' | 'bottom' }>`
  position: absolute;
  z-index: 2;
  ${({ $placement }) => ($placement === 'top' ? 'top: 52px; right: 7%;' : 'bottom: 48px; left: 5%;')}
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  color: ${({ theme }) => theme.colors.text};
  font-size: 10px;
  font-weight: 800;
`;

export const Section = styled.section`
  padding: 22px 0 76px;

  @media (max-width: 700px) {
    padding-bottom: 54px;
  }
`;

export const SectionTopline = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;

  @media (max-width: 640px) {
    align-items: start;
    flex-direction: column;
  }
`;

export const SectionEyebrow = styled.div`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 900;
  letter-spacing: -0.065em;
  line-height: 1.1;
`;

export const SectionDescription = styled.p`
  max-width: 430px;
  margin: 10px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.7;
`;

export const KitSection = styled.section`
  padding: 66px 0 76px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  transition: background ${({ theme }) => theme.motion.slow};
`;

export const KitGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 18px;
  margin-top: 28px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

export const KitCard = styled.div`
  min-width: 0;
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

export const KitCardTitle = styled.h3`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -0.035em;
`;

export const VariantGroup = styled.div`
  display: grid;
  gap: 13px;
`;

export const VariantRow = styled.div`
  display: grid;
  grid-template-columns: 84px repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 8px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr 1fr;

    & > span {
      grid-column: 1 / -1;
    }

    & > button {
      min-width: 0;
      padding-right: 6px;
      padding-left: 6px;
      font-size: 10px;
    }
  }
`;

export const VariantName = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-weight: 800;
`;

export const SizeLabel = styled.div`
  display: grid;
  grid-template-columns: 84px repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 7px;

  span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 9px;
    text-align: center;
  }

  @media (max-width: 500px) {
    display: none;
  }
`;

export const BadgeExamples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InputExample = styled.div`
  display: grid;
  gap: 15px;
`;

export const KitCardText = styled.p`
  margin: 14px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.65;
`;

export const Footer = styled.footer`
  padding: 28px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;
`;

export const FooterInner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  strong {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 600px) {
    align-items: start;
    flex-direction: column;
  }
`;
