import EducationSection from "@/components/about/EducationSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import CommonBanner from "@/components/common/CommonBanner";
import CtaPro from "@/components/common/Cta";
import SmoothScroll from "@/components/common/SmoothScroll";
import { getAllEducation, getAllExperiences } from "sanity-lib";


export const revalidate = 3600;

export const metadata = {
  title: "About | Portfolio",
  description: "My professional experience and education background.",
};

export default async function AboutPage() {
  const experiences = await getAllExperiences();
  const educationList = await getAllEducation();

  return (
    <SmoothScroll>
      <div>
        <CommonBanner title="About Me" />

        <div className="container">
          <ExperienceSection experiences={experiences} />
          <EducationSection educationList={educationList} />
        </div>

        <CtaPro />
      </div>
    </SmoothScroll>
  );
}
