import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock3,
  Compass,
  MapPin,
  ParkingCircle,
  Sparkles,
} from "lucide-react";
import { mallInfo, services } from "../../data/mallInfo";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import PageTransition from "../../components/layout/PageTransition";

export default function VisitPage() {
  const [copied, setCopied] = useState(false);

  const copyLocation = async () => {
    try {
      await navigator.clipboard.writeText(mallInfo.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy the sample address.", error);
    }
  };

  return (
    <PageTransition>
      <div className="visit-page">
        <section className="visit-masthead">
          <div className="visit-masthead-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              WE&rsquo;LL SAVE YOU A PLACE
            </p>
            <h1>
              Come on
              <br />
              <em>over.</em>
            </h1>
            <p>
              Getting here should be easy. Find the essentials for planning your
              visit, with confirmed details to follow.
            </p>
          </div>
          <div className="visit-architecture">
            <ImageWithFallback
              src="/images/mall/entrance.webp"
              alt="Orion Mall entrance"
              className="visit-architecture-image"
            />
            <span>ORION / GORAKHPUR</span>
          </div>
        </section>

        <section className="visit-information">
          <div className="visit-address-card">
            <span className="eyebrow">FIND ORION</span>
            <MapPin size={24} />
            <h2>
              A place to
              <br />
              <em>gather.</em>
            </h2>
            <p>{mallInfo.address}</p>
            <div className="visit-address-actions">
              <a
                className="button button-dark"
                href="https://maps.google.com/?q=Orion+Mall+Gorakhpur"
                target="_blank"
                rel="noreferrer"
              >
                Open map <ArrowUpRight size={15} />
              </a>
              <button className="button button-outline" onClick={copyLocation}>
                {copied ? "Copied" : "Copy address"}
              </button>
            </div>
            <small>
              Map search is a placeholder until the verified location is
              supplied.
            </small>
          </div>
          <div className="visit-faqs">
            {[
              ["Opening hours", mallInfo.hours, Clock3],
              [
                "Getting here",
                "Directions and public transport information to be confirmed.",
                Compass,
              ],
              ["Parking", mallInfo.parking, ParkingCircle],
              [
                "Visitor services",
                services.map((item) => item.name).join(" &middot; "),
                Sparkles,
              ],
              ["Contact", mallInfo.phone, MapPin],
            ].map(([title, detail, Icon]) => (
              <details key={title}>
                <summary>
                  <span>
                    <Icon size={17} /> {title}
                  </span>
                  <b>+</b>
                </summary>
                <p>{detail}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="visit-cta-strip">
          <div>
            <p className="eyebrow">YOUR DAY, YOUR WAY</p>
            <h2>
              Find the places
              <br />
              <em>you&rsquo;ll love.</em>
            </h2>
          </div>
          <Link to="/explore" className="text-link">
            Explore the mall <ArrowUpRight size={14} />
          </Link>
        </section>
        <p className="page-disclaimer">{mallInfo.note}</p>
      </div>
    </PageTransition>
  );
}
