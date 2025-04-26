import Category from "./Category";
import Featured from "./Featured";
import HeroSection from "./HeroSection";
import Landing from "./Landing";
import RecentPosts from "./RecentPosts";
import Recommendation from "./Recommendation";

const Home = () => {
  return (
    <>
      <HeroSection />
      <RecentPosts />
      <Landing />
      <Recommendation />
      <Category />
      <Featured />
    </>
  );
};

export default Home;
