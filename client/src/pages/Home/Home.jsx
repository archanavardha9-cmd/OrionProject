import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { motion } from "framer-motion";
import { floors } from "../../data/floors";
import { stores, storesByFloor } from "../../data/stores";
import PageTransition from "../../components/layout/PageTransition";

const InteractiveCar = lazy(() => import("../../components/3d/InteractiveCar"));

const featuredSlugs = [
  "max-fashion",
  "idelta-apple-authorized-reseller",
  "soch",
  "pvr-inox-cinemas-multiplex",
];

const floorImage = {
  0: "/images/mall/ground-floor.webp",
  1: "/images/mall/first-floor.webp",
  2: "/images/mall/second-floor.webp",
  3: "/images/mall/third-floor.webp",
  4: "/images/entertainment/cinema.webp",
  5: "/images/dining/restaurant.webp",
};

function LazyCarExperience() {
  const slot = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const element = slot.current;
    if (!element || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-car-lazy-slot" ref={slot}>
      {shouldLoad ? (
        <Suspense
          fallback={
            <div className="home-car-lazy-placeholder" aria-hidden="true" />
          }
        >
          <InteractiveCar />
        </Suspense>
      ) : (
        <div className="home-car-lazy-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

export default function HomePage() {
  const featuredStores = featuredSlugs
    .map((slug) => stores.find((store) => store.slug === slug))
    .filter(Boolean);

  return (
    <PageTransition>
      <div className="home-page">
        <section className="home-hero">
          <img
            src="/images/homepage/exterior.webp"
            alt="Orion Mall illuminated at dusk"
            className="home-hero-image"
            fetchPriority="high"
          />
          <div className="home-hero-shade" />
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="eyebrow">
              <span className="eyebrow-line" />
              YOUR CITY, A LITTLE MORE ORION
            </p>
            <h1>
              More to do.
              <br />
              <em>More to feel.</em>
            </h1>
            <p>
              Style, food, play and the big-screen feeling—meet your next
              favourite day at Orion Mall Gorakhpur.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/explore">
                Explore the mall <Compass size={17} />
              </Link>
              <Link className="button button-quiet" to="/stores">
                Browse all 45 destinations <ArrowDownRight size={17} />
              </Link>
            </div>
          </motion.div>
          <div className="home-hero-index">
            <span>26° 45′ N</span>
            <i />
            Gorakhpur, India
          </div>
          <Link className="home-hero-scroll" to="#mall-levels">
            Discover the mall <ArrowDownRight size={15} />
          </Link>
        </section>

        <section
          className="home-intro-strip"
          aria-label="Orion Mall at a glance"
        >
          <p>Six floors. A city’s worth of reasons to stay.</p>
          <div>
            <span>
              <strong>06</strong> LEVELS
            </span>
            <span>
              <strong>{stores.length}</strong> DESTINATIONS
            </span>
            <span>
              <strong>01</strong> ORION
            </span>
          </div>
        </section>

        <section className="home-floor-section" id="mall-levels">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow">THE MALL, LEVEL BY LEVEL</p>
              <h2>
                Six floors.
                <br />
                <em>Find your pace.</em>
              </h2>
            </div>
            <Link to="/explore" className="text-link">
              Open the Explorer <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="home-floor-grid">
            {floors.map((floor, index) => {
              const count = storesByFloor(floor.number).length;
              return (
                <Link
                  key={floor.id}
                  to={`/stores?floor=${floor.number}`}
                  className={`home-floor-card home-floor-card-${index + 1}`}
                  style={{
                    "--floor-image": `url("${floorImage[floor.number]}")`,
                  }}
                >
                  <span className="home-floor-label">{floor.label}</span>
                  <div>
                    <small>{String(count).padStart(2, "0")} DESTINATIONS</small>
                    <h3>{floor.name}</h3>
                    <p>{floor.wing}</p>
                  </div>
                  <span className="home-floor-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <LazyCarExperience />

        <section className="home-featured-section">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow">A FEW PLACES TO BEGIN</p>
              <h2>
                First stops,
                <br />
                <em>good stories.</em>
              </h2>
            </div>
            <Link to="/stores" className="text-link">
              See the full directory <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="home-featured-grid">
            {featuredStores.map((store, index) => (
              <Link
                to={`/stores?slug=${store.slug}`}
                className={`home-feature-card home-feature-card-${index + 1}`}
                key={store.id}
              >
                <span className="feature-card-index">0{index + 1}</span>
                <span className="feature-card-category">{store.category}</span>
                <strong>{store.brand}</strong>
                <span className="feature-card-floor">
                  {store.floor === 0 ? "Ground floor" : `Floor ${store.floor}`}
                </span>
                <ArrowUpRight className="feature-card-arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>

        <section className="home-day-section">
          <div className="home-day-image">
            <img
              src="/images/homepage/mall-atrium.webp"
              alt="The mall atrium"
              loading="lazy"
            />
            <span>ORION / GORAKHPUR</span>
          </div>
          <div className="home-day-copy">
            <p className="eyebrow">MAKE A DAY OF IT</p>
            <h2>
              Take the long
              <br />
              <em>way around.</em>
            </h2>
            <p>
              Browse the complete directory, stop for a bite on the third floor,
              or head upstairs for a film and something to sip.
            </p>
            <div className="home-day-links">
              <Link to="/dining">
                <Utensils size={18} />
                <span>
                  Dining<small>F3 · F4 · F5</small>
                </span>
                <ArrowUpRight size={16} />
              </Link>
              <Link to="/entertainment">
                <ShoppingBag size={18} />
                <span>
                  Entertainment<small>Game Zone · PVR INOX</small>
                </span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="home-closing">
          <p className="eyebrow">YOUR NEXT ORION DAY STARTS HERE</p>
          <h2>
            Ready when
            <br />
            <em>you are.</em>
          </h2>
          <Link className="button button-light" to="/explore">
            Find your way around <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
    </PageTransition>
  );
}
