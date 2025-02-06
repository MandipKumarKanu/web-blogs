import Category from "./Category";
import Featured from "./Featured";
import HeroSection from "./HeroSection";
import Landing from "./Landing";
import RecentPosts from "./RecentPosts";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <RecentPosts />
      <Landing />
      <Category />
      <Featured />
    </div>
  );
};

export default Home;
