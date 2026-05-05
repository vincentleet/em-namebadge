import { useMemo, useRef, useState } from "react";

const ROLE_OPTIONS = ["Game Master", "Operations Manager"];
const CUSTOM_ROLE_VALUE = "__custom_role__";
const DEFAULT_BG = `${import.meta.env.BASE_URL}namebadge-bg.png?v=5`;
const NAME_FONT_FAMILY =
  '"Panton Black Caps", "PantonFallback", "Arial Black", "Segoe UI Black", sans-serif';
const NAME_MAX_WIDTH_PX = 164;
const NAME_MAX_SIZE_PX = 28;
const NAME_MIN_SIZE_PX = 17;
const BADGES_PER_PAGE = 14;

const measureCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;
const measureContext = measureCanvas ? measureCanvas.getContext("2d") : null;

function createBadge(id) {
  return {
    id,
    firstName: "Vincent",
    role: ROLE_OPTIONS[0],
    customRole: "",
  };
}

function getNameFontSize(name) {
  const normalized = name.trim().toUpperCase();
  if (!normalized) return NAME_MAX_SIZE_PX;
  if (!measureContext) return 24;

  let size = NAME_MAX_SIZE_PX;
  while (size > NAME_MIN_SIZE_PX) {
    measureContext.font = `900 ${size}px ${NAME_FONT_FAMILY}`;
    const textWidth = measureContext.measureText(normalized).width;
    if (textWidth <= NAME_MAX_WIDTH_PX) {
      return size;
    }
    size -= 1;
  }

  return NAME_MIN_SIZE_PX;
}

function chunkBadges(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function App() {
  const [nextId, setNextId] = useState(2);
  const [badges, setBadges] = useState([createBadge(1)]);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const pdfExportRef = useRef(null);
  const backgroundImage = DEFAULT_BG;

  const canRemove = badges.length > 1;
  const badgeCountText = useMemo(
    () => `${badges.length} badge${badges.length === 1 ? "" : "s"}`,
    [badges.length]
  );
  const badgePages = useMemo(() => chunkBadges(badges, BADGES_PER_PAGE), [badges]);

  const addBadge = () => {
    setBadges((prev) => [...prev, createBadge(nextId)]);
    setNextId((prev) => prev + 1);
  };

  const updateBadge = (id, field, value) => {
    setBadges((prev) =>
      prev.map((badge) => (badge.id === id ? { ...badge, [field]: value } : badge))
    );
  };

  const removeBadge = (id) => {
    setBadges((prev) => (prev.length > 1 ? prev.filter((badge) => badge.id !== id) : prev));
  };

  const savePdf = async () => {
    if (!pdfExportRef.current || isSavingPdf) return;
    setIsSavingPdf(true);
    let clone = null;

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      clone = pdfExportRef.current.cloneNode(true);
      clone.classList.add("pdfRenderClone");
      clone.classList.add("pdfExportTarget");
      document.body.appendChild(clone);

      const sheets = Array.from(clone.querySelectorAll(".a4Sheet"));
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      for (let index = 0; index < sheets.length; index += 1) {
        const canvas = await html2canvas(sheets[index], {
          scale: 4,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imageData = canvas.toDataURL("image/png");
        if (index > 0) pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, 0, 210, 297, undefined, "FAST");
      }

      pdf.save("escape-masters-name-badges.pdf");
    } finally {
      if (clone) clone.remove();
      setIsSavingPdf(false);
    }
  };

  return (
    <main className="appShell">
      <header className="headerBar">
        <div>
          <h1>Escape Masters Name Badge Generator</h1>
          <p className="headerCredit">Created by Vincent Lee</p>
        </div>
        <div className="headerPurchaseBlock">
          <p className="headerPurchaseLabel">Need blank badges?</p>
          <a
            className="headerPurchaseLink"
            href="https://www.temu.com/nz/10-15-sets-magnetic-name-tag-sets-1-2-inch-3-inch-magnetic-badge-clips-with-strong-magnets-transparent-acrylic--display-clips-suitable-for-business-events-school-offices-g-601105495159770.html?_oak_mp_inf=ENrni7y81ogBGiA4NTJhMTg3ZGYzZTE0ZGQyYmNhNzk1NWU4NDhkYjFhZCDQhaT63TM%3D&top_gallery_url=https%3A%2F%2Fimg.kwcdn.com%2Fproduct%2Ffancy%2Fbb8e8c9d-70aa-4901-be39-17a63f9e61d2.jpg&spec_gallery_id=446940&refer_page_sn=10009&freesia_scene=2&_oak_freesia_scene=2&_oak_rec_ext_1=MTc1Mg&search_query=name%20badge%203%20in%201.2%20in&search_key=name%20badge%203%20in%201.2%20in&refer_page_el_sn=200049&operate_cart_extend_map=%7B%22add_cart_use_layer%22%3A1%7D&ab_scene=1&enable_vqr=0&refer_page_name=search_result&refer_page_id=10009_1777567573846_cdp9c3fbkj&_x_sessn_id=xm35xbj6d2"
            target="_blank"
            rel="noreferrer"
          >
            Buy magnetic name badges on Temu
          </a>
        </div>
      </header>

      <section className="workspace">
        <aside className="editorPanel">
          <div className="editorPanelHead">
            <div>
              <h2>Badge Editor</h2>
              <p className="panelHint">{badgeCountText}</p>
            </div>
            <button type="button" onClick={addBadge}>
              Add Badge
            </button>
          </div>
          <div className="editorList">
            {badges.map((badge) => (
              <article className="editorCard" key={badge.id}>
                <label>
                  First Name
                  <input
                    type="text"
                    value={badge.firstName}
                    maxLength={22}
                    onChange={(event) =>
                      updateBadge(badge.id, "firstName", event.target.value.toUpperCase())
                    }
                    placeholder="e.g. Vincent"
                  />
                </label>

                <label>
                  Role
                  {badge.role === CUSTOM_ROLE_VALUE ? (
                    <>
                      <input
                        type="text"
                        value={badge.customRole}
                        maxLength={28}
                        onChange={(event) =>
                          updateBadge(badge.id, "customRole", event.target.value.toUpperCase())
                        }
                        placeholder="Enter custom role"
                      />
                      <button
                        type="button"
                        className="ghostBtn"
                        onClick={() => {
                          updateBadge(badge.id, "role", ROLE_OPTIONS[0]);
                          updateBadge(badge.id, "customRole", "");
                        }}
                      >
                        Use preset roles
                      </button>
                    </>
                  ) : (
                    <select
                      value={badge.role}
                      onChange={(event) => updateBadge(badge.id, "role", event.target.value)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      <option value={CUSTOM_ROLE_VALUE}>Custom role...</option>
                    </select>
                  )}
                </label>

                <button
                  type="button"
                  className="danger removeBtn"
                  onClick={() => removeBadge(badge.id)}
                  disabled={!canRemove}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        </aside>

        <section className="previewPanel">
          <div className="previewPanelHead">
            <div>
              <h2>A4 Print Preview</h2>
              <p className="panelHint">Each badge is rendered at 3in x 1.2in.</p>
            </div>
            <button type="button" className="savePdfBtn" onClick={savePdf} disabled={isSavingPdf}>
              {isSavingPdf ? "Saving..." : "Save PDF"}
            </button>
          </div>
          <div className="a4Pages" ref={pdfExportRef}>
            {badgePages.map((pageBadges, pageIndex) => (
              <div className="a4Sheet" key={`page-${pageIndex}`}>
                {pageBadges.map((badge) => {
                  const firstName = badge.firstName.trim() || "FIRST NAME";
                  const firstNameSize = getNameFontSize(firstName);
                  const roleText =
                    badge.role === CUSTOM_ROLE_VALUE
                      ? badge.customRole.trim() || "CUSTOM ROLE"
                      : badge.role;
                  return (
                    <article
                      key={`preview-${badge.id}`}
                      className="badge"
                    >
                      <img className="badgeBg" src={backgroundImage} alt="" aria-hidden="true" />
                      <p className="firstName" style={{ fontSize: `${firstNameSize}px` }}>
                        {firstName.toUpperCase()}
                      </p>
                      <p className="roleText">{roleText.toUpperCase()}</p>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
