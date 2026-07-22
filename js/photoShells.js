/**
 * Theme-driven photo chapter shells.
 * Each age renders as a screenshot of that year's interface;
 * the personal photo lives in an inset slot (not a full-bleed Polaroid).
 * Homage only — no trademark assets.
 */

/**
 * @param {{ chapterId:string, age:number, hint:string, multi:boolean, ariaExtra:string }} opts
 */
function photoSlot({ chapterId, age, hint, multi, ariaExtra }) {
  return `
    <div class="frame-wrap${multi ? " is-multi" : ""}" data-frame-wrap>
      ${multi ? `
        <div class="frame-peek" aria-hidden="true">
          <img alt="" data-peek-img />
        </div>
      ` : ""}
      <div class="frame" data-image-id="${chapterId}" data-photo-index="0" tabindex="0" role="button" aria-label="Photo for age ${age}${ariaExtra}">
        <img alt="" data-main-img />
        <div class="dropzone">
          <div class="plus">+</div>
          <span>${hint}</span>
        </div>
      </div>
    </div>
  `;
}

/** @param {string} slot */
const SHELLS = {
  "win95-window": (slot, { year }) => `
    <div class="shell shell-win95" aria-hidden="false">
      <div class="shell-win95-icons" aria-hidden="true">
        <span class="shell-w95-icon">My Computer</span>
        <span class="shell-w95-icon">Network</span>
        <span class="shell-w95-icon is-open">My Pictures</span>
      </div>
      <div class="shell-window">
        <div class="shell-titlebar">
          <span>My Pictures — ${year}.bmp</span>
          <span class="shell-w95-ctrls" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>
        </div>
        <div class="shell-menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
        <div class="shell-client">${slot}</div>
        <div class="shell-statusbar" aria-hidden="true"><span>1 object(s)</span><span>${year}</span></div>
      </div>
      <div class="shell-taskbar" aria-hidden="true">
        <span class="shell-start">Start</span>
        <span class="shell-task is-on">My Pictures</span>
        <span class="shell-tray">12:00 PM</span>
      </div>
    </div>
  `,

  "geocities-page": (slot) => `
    <div class="shell shell-geocities">
      <div class="shell-geo-banner" aria-hidden="true">★ Under Construction ★ Best viewed in Netscape ★</div>
      <div class="shell-geo-grid">
        <aside class="shell-geo-side" aria-hidden="true">
          <p class="shell-geo-hit">Visitor #0047</p>
          <p>♪ MIDI on</p>
          <p>Links</p>
          <ul><li>Home</li><li>Pics</li><li>Guestbook</li></ul>
        </aside>
        <div class="shell-geo-main">
          <h3 class="shell-geo-h" aria-hidden="true">~chris / my photos</h3>
          <div class="shell-geo-well">${slot}</div>
          <p class="shell-geo-foot" aria-hidden="true">Last updated: yesterday · Sign my guestbook!</p>
        </div>
      </div>
    </div>
  `,

  search98: (slot, { year }) => `
    <div class="shell shell-search98">
      <div class="shell-s98-top" aria-hidden="true">
        <div class="shell-s98-logo"><span class="c-b">G</span><span class="c-r">o</span><span class="c-y">o</span><span class="c-b">g</span><span class="c-g">l</span><span class="c-r">e</span><span class="c-b">!</span></div>
        <div class="shell-s98-query">chris ${year}</div>
      </div>
      <div class="shell-s98-body">
        <div class="shell-s98-meta" aria-hidden="true">Results 1–10 of about 25,000,000</div>
        <div class="shell-s98-hit">
          <div class="shell-s98-thumb">${slot}</div>
          <div class="shell-s98-copy" aria-hidden="true">
            <p class="shell-s98-title">A year of my life — ${year}</p>
            <p class="shell-s98-url">http://localhost/life/${year}/</p>
            <p class="shell-s98-snip">Cached snapshot of a moment while the medium kept upgrading…</p>
          </div>
        </div>
      </div>
    </div>
  `,

  "treasure-mountain": (slot) => `
    <div class="shell shell-tm" role="img" aria-label="Treasure Mountain style riddle screen homage">
      <div class="tm-stage">
        <div class="tm-scroll">
          <div class="tm-roll tm-roll-l" aria-hidden="true"></div>
          <div class="tm-parchment">
            <div class="tm-riddle" aria-hidden="true">
              <p>I'm thinking of something</p>
              <p>you dreamed before you could drive.</p>
              <p>Red and white, number eighteen —</p>
              <p>wheels bigger than the dreamer.</p>
              <p>I've hidden the two words</p>
              <p>that make up this compound word.</p>
              <p>Which row has the two words?</p>
            </div>
            <div class="tm-photo-well">${slot}</div>
            <div class="tm-rows" aria-hidden="true">
              <div class="tm-row is-on">race car dream</div>
              <div class="tm-row">wheel shop smile</div>
              <div class="tm-row">red white eighteen</div>
            </div>
            <div class="tm-elf" aria-hidden="true">
              <span class="tm-elf-hat"></span>
              <span class="tm-elf-face"></span>
              <span class="tm-elf-body"></span>
              <span class="tm-elf-legs"></span>
            </div>
          </div>
          <div class="tm-roll tm-roll-r" aria-hidden="true"></div>
        </div>
      </div>
      <div class="tm-statusbar" aria-hidden="true">
        <div class="tm-cell tm-help">
          <span class="tm-help-icon"></span>
          <span class="tm-cell-label">HELP</span>
        </div>
        <div class="tm-cell tm-coins">
          <span class="tm-cell-label">COINS</span>
          <span class="tm-coin-stack"></span>
          <span class="tm-stat">20</span>
        </div>
        <div class="tm-cell tm-nets">
          <span class="tm-cell-label">NETS</span>
          <span class="tm-net-icon"></span>
          <span class="tm-stat">46</span>
        </div>
        <div class="tm-cell tm-treasures">
          <span class="tm-cell-label">TREASURES</span>
          <span class="tm-pack"></span>
          <span class="tm-gems"><i></i><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
    </div>
  `,

  "petsite-well": (slot) => `
    <div class="shell shell-petsite">
      <aside class="shell-pet-nav" aria-hidden="true">
        <div class="shell-pet-brand">Pet World</div>
        <ul>
          <li class="is-on">Home</li>
          <li>Pets</li>
          <li>Games</li>
          <li>Shops</li>
          <li>Albums</li>
        </ul>
      </aside>
      <div class="shell-pet-main">
        <header class="shell-pet-head" aria-hidden="true">
          <span>Welcome back!</span>
          <span class="shell-pet-neopoints">★ 1,250 pts</span>
        </header>
        <div class="shell-pet-panel">
          <h3 aria-hidden="true">Photo Album</h3>
          <div class="shell-pet-well">${slot}</div>
        </div>
      </div>
    </div>
  `,

  "y2k-terminal": (slot) => `
    <div class="shell shell-y2k">
      <div class="shell-y2k-hud" aria-hidden="true">
        <span>SYSTEM CLOCK</span>
        <span class="shell-y2k-count">00:00:01</span>
        <span>STATUS: OK?</span>
      </div>
      <div class="shell-y2k-monitor">
        <p class="shell-y2k-label" aria-hidden="true">&gt; LOAD MEMORY_DUMP.BMP</p>
        <div class="shell-y2k-slot">${slot}</div>
      </div>
    </div>
  `,

  "desktop-window": (slot, { year }) => `
    <div class="shell shell-desktop">
      <div class="shell-desk-bg" aria-hidden="true"></div>
      <div class="shell-window is-xp">
        <div class="shell-titlebar is-xp">
          <span>My Pictures — ${year}</span>
          <span class="shell-xp-ctrls" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>
        </div>
        <div class="shell-client is-xp">${slot}</div>
        <div class="shell-statusbar is-xp" aria-hidden="true"><span>Preview</span><span>${year}</span></div>
      </div>
    </div>
  `,

  messenger: (slot) => `
    <div class="shell shell-messenger">
      <div class="shell-msn-window">
        <div class="shell-titlebar is-msn">
          <span>● Online — Photo share</span>
          <span class="shell-w95-ctrls" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>
        </div>
        <div class="shell-msn-body">
          <aside class="shell-msn-list" aria-hidden="true">
            <p class="is-on">● Chris</p>
            <p>● Dad</p>
            <p>○ Away</p>
          </aside>
          <div class="shell-msn-chat">
            <div class="shell-msn-bubble" aria-hidden="true">hey check this out</div>
            <div class="shell-msn-attach">${slot}</div>
            <div class="shell-msn-compose" aria-hidden="true">Type a message…</div>
          </div>
        </div>
      </div>
    </div>
  `,

  gba: (slot) => `
    <div class="shell shell-gba">
      <div class="gba-sp-stage">
        <div class="gba-sp" aria-label="Handheld SP homage — photo on Color LCD">
          <div class="gba-sp-lid">
            <span class="gba-sp-bump tl" aria-hidden="true"></span>
            <span class="gba-sp-bump tr" aria-hidden="true"></span>
            <span class="gba-sp-bump bl" aria-hidden="true"></span>
            <span class="gba-sp-bump br" aria-hidden="true"></span>
            <div class="gba-sp-bezel">
              <div class="gba-sp-lcd">
                ${slot}
                <span class="gba-sp-glass" aria-hidden="true"></span>
              </div>
              <span class="gba-sp-mark" aria-hidden="true">HANDHELD SP</span>
            </div>
          </div>
          <div class="gba-sp-join" aria-hidden="true">
            <div class="gba-sp-hinge">
              <span class="gba-sp-hinge-seg is-outer"></span>
              <span class="gba-sp-hinge-seg is-mid"></span>
              <span class="gba-sp-hinge-seg is-outer"></span>
            </div>
          </div>
          <div class="gba-sp-base">
            <div class="gba-sp-contact" aria-hidden="true"></div>
            <div class="gba-sp-shoulders" aria-hidden="true"><span>L</span><span>R</span></div>
            <div class="gba-sp-face" aria-hidden="false">
              <div class="gba-sp-dpad" aria-hidden="true"><span></span></div>
              <div class="gba-sp-mid" aria-hidden="true">
                <i class="gba-sp-bright"></i>
                <i class="gba-sp-speaker"></i>
              </div>
              <div class="gba-sp-ab" aria-hidden="true"><b>B</b><b>A</b></div>
              <div class="gba-sp-ss" aria-hidden="true">
                <span><em>SELECT</em><i></i></span>
                <span><em>START</em><i></i></span>
              </div>
            </div>
            <div class="gba-sp-edge-l" aria-hidden="true"></div>
            <div class="gba-sp-edge-r" aria-hidden="true"><i></i></div>
            <div class="gba-sp-cart" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  `,

  tamagotchi: (slot) => `
    <div class="shell shell-tama">
      <div class="shell-tama-egg">
        <div class="shell-tama-bezel">
          <div class="shell-tama-lcd">${slot}</div>
        </div>
        <div class="shell-tama-buttons" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
    </div>
  `,

  snowball: (slot) => `
    <div class="shell shell-snowball">
      <div class="shell-sb-client">
        <header class="shell-sb-bar" aria-hidden="true">
          <span>❄ Island Lobby</span>
          <span>Online: 842</span>
        </header>
        <div class="shell-sb-stage">
          <div class="shell-sb-igloo" aria-hidden="true">
            <div class="shell-sb-igloo-roof"></div>
            <div class="shell-sb-igloo-door"></div>
          </div>
          <div class="shell-sb-postcard">
            <p class="shell-sb-post-label" aria-hidden="true">Postcard</p>
            ${slot}
          </div>
          <div class="shell-sb-chat" aria-hidden="true">
            <span class="shell-sb-bubble">nice photo!</span>
          </div>
        </div>
        <footer class="shell-sb-dock" aria-hidden="true">
          <span>Map</span><span>Friends</span><span class="is-on">Igloo</span><span>Mail</span>
        </footer>
      </div>
    </div>
  `,

  "social-profile": (slot) => {
    const friends = [
      "sam", "jules", "kai", "morgan", "alex", "riley", "casey", "drew",
      "jamie", "quinn", "avery", "skye", "blake", "reed", "fin", "oakley",
      "harper", "rowan", "sage", "lane", "parker", "charlie", "devon", "ellis",
    ];
    const friendCells = friends
      .map(
        (name, i) => `
        <div class="bebo-friend" aria-hidden="true">
          <span class="bebo-friend-av" data-tone="${i % 8}"></span>
          <span class="bebo-friend-name">${name}</span>
        </div>`
      )
      .join("");
    return `
    <div class="shell shell-bebo">
      <div class="bebo-maint" aria-hidden="true">this profile is under maintenance · a message from 2006</div>
      <nav class="bebo-nav" aria-hidden="true">
        <span class="bebo-wordmark"><b>bee</b><i>bo</i></span>
        <ul class="bebo-links">
          <li class="is-on">Profile</li>
          <li>Friends</li>
          <li>Photos</li>
          <li>Groups</li>
          <li>Blog</li>
        </ul>
        <span class="bebo-search">Search friends…</span>
      </nav>
      <div class="bebo-skin">
        <h2 class="bebo-name">Chris Edwards</h2>
        <div class="bebo-grid">
          <aside class="bebo-col bebo-col-left">
            <div class="bebo-avatar">${slot}</div>
            <div class="bebo-actions" aria-hidden="true">
              <a href="#" tabindex="-1" onclick="return false">Add as Friend</a>
              <a href="#" tabindex="-1" onclick="return false">Send Message</a>
              <a href="#" tabindex="-1" onclick="return false">Give Love</a>
            </div>
            <div class="bebo-stats" aria-hidden="true">
              <span>Views: 48,291</span>
              <span class="bebo-love">♥ 1,204</span>
            </div>
          </aside>
          <div class="bebo-col bebo-col-main">
            <section class="bebo-mod bebo-comment-box">
              <header aria-hidden="true"><span class="bebo-mod-ico">✎</span> Post a comment</header>
              <div class="bebo-comment-field" aria-hidden="true">say something nice…</div>
              <div class="bebo-comment-btns" aria-hidden="true">
                <button type="button" tabindex="-1">Attach Photo</button>
                <button type="button" tabindex="-1">Post Comment</button>
              </div>
            </section>
            <section class="bebo-mod">
              <header aria-hidden="true">Top Friends <span>(24)</span></header>
              <div class="bebo-friends">${friendCells}</div>
            </section>
            <section class="bebo-mod bebo-about" aria-hidden="true">
              <header>About me</header>
              <p>Born 22 Aug 1995 · New Zealand · currently learning every interface I can find.</p>
              <p>Music: whatever’s on the shared PC. Mood: custom skin unlocked.</p>
            </section>
          </div>
          <aside class="bebo-col bebo-col-right" aria-hidden="true">
            <section class="bebo-mod bebo-video">
              <header>Videos</header>
              <div class="bebo-video-stage">▶</div>
            </section>
            <section class="bebo-mod bebo-badges">
              <header>Badges</header>
              <div class="bebo-badge-row">
                <span data-b="0"></span><span data-b="1"></span><span data-b="2"></span>
                <span data-b="3"></span><span data-b="4"></span><span data-b="5"></span>
              </div>
            </section>
            <section class="bebo-mod bebo-wall">
              <header>Comments</header>
              <div class="bebo-wall-item"><span class="bebo-wall-av"></span><div><strong>sam</strong> · 2 hrs ago<p>sick skin!!</p></div></div>
              <div class="bebo-wall-item"><span class="bebo-wall-av" data-tone="2"></span><div><strong>jules</strong> · yesterday<p>happy birthday for august lol</p></div></div>
              <div class="bebo-wall-item"><span class="bebo-wall-av" data-tone="5"></span><div><strong>kai</strong> · last week<p>add me back</p></div></div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  `;
  },

  "touch-device": (slot) => `
    <div class="shell shell-touch">
      <div class="shell-phone">
        <div class="shell-phone-notch" aria-hidden="true"></div>
        <div class="shell-phone-screen">${slot}</div>
        <div class="shell-phone-home" aria-hidden="true"></div>
      </div>
    </div>
  `,

  "game-hud": (slot) => `
    <div class="shell shell-game">
      <div class="shell-game-hud" aria-hidden="true">
        <span>HP ████░░</span>
        <span>XP 1,280</span>
        <span>QUEST LOG</span>
      </div>
      <div class="shell-game-viewport">${slot}</div>
      <div class="shell-game-bar" aria-hidden="true">Inventory · Map · Skills</div>
    </div>
  `,

  /** Early craft-web / minecraft.net May 2009 homage — photo in centered content well */
  "minecraft-2009": (slot) => `
    <div class="shell shell-mc09">
      <div class="mc09-logo" aria-hidden="true">
        <span class="mc09-logo-face">CRAFT</span>
      </div>
      <div class="mc09-panel">
        <form class="mc09-login" aria-hidden="true" onsubmit="return false">
          <label>Username: <input type="text" value="chris" readonly tabindex="-1" /></label>
          <label>Password: <input type="password" value="••••••••" readonly tabindex="-1" /></label>
          <button type="button" class="mc09-btn" tabindex="-1">Log in!</button>
          <a href="#" class="mc09-link" tabindex="-1" onclick="return false">Register an account</a>
        </form>
        <div class="mc09-photo">${slot}</div>
        <div class="mc09-copy" aria-hidden="true">
          <h3>Nothing here yet!</h3>
          <p>But you can register to claim your name.</p>
          <p>
            <a href="#" class="mc09-link" tabindex="-1" onclick="return false">The alpha test is here</a>
            &nbsp;·&nbsp;
            <a href="#" class="mc09-link" tabindex="-1" onclick="return false">here's my blog</a>
          </p>
        </div>
      </div>
    </div>
  `,

  "social-feed": (slot, { year }) => `
    <div class="shell shell-feed">
      <header class="shell-feed-bar" aria-hidden="true">
        <span>feed</span>
        <span>${year}</span>
      </header>
      <article class="shell-feed-post">
        <div class="shell-feed-who" aria-hidden="true">
          <span class="shell-feed-avatar"></span>
          <span>chris · just now</span>
        </div>
        <div class="shell-feed-media">${slot}</div>
        <div class="shell-feed-actions" aria-hidden="true">♡ Comment Share</div>
      </article>
    </div>
  `,

  "flat-card": (slot) => `
    <div class="shell shell-flat">
      <div class="shell-flat-card">
        <div class="shell-flat-toolbar" aria-hidden="true">
          <span class="shell-fab"></span>
          <span>Gallery</span>
        </div>
        <div class="shell-flat-media">${slot}</div>
      </div>
    </div>
  `,

  workspace: (slot) => `
    <div class="shell shell-workspace">
      <aside class="shell-ws-side" aria-hidden="true">
        <p># general</p>
        <p class="is-on"># photos</p>
        <p># random</p>
      </aside>
      <div class="shell-ws-main">
        <header class="shell-ws-head" aria-hidden="true"># photos</header>
        <div class="shell-ws-msg">
          <p aria-hidden="true">chris uploaded a file</p>
          <div class="shell-ws-file">${slot}</div>
        </div>
      </div>
    </div>
  `,

  "design-artboard": (slot, { year }) => `
    <div class="shell shell-figma">
      <aside class="shell-fig-layers" aria-hidden="true">
        <p>Page 1</p>
        <p class="is-on">Frame ${year}</p>
        <p>Photo</p>
      </aside>
      <div class="shell-fig-canvas">
        <div class="shell-fig-frame">
          <span class="shell-fig-label" aria-hidden="true">Frame ${year} — 1440×900</span>
          ${slot}
        </div>
      </div>
      <aside class="shell-fig-props" aria-hidden="true">
        <p>Design</p>
        <p>Prototype</p>
        <p>Fill · Image</p>
      </aside>
    </div>
  `,

  "ai-pane": (slot) => `
    <div class="shell shell-ai">
      <div class="shell-ai-chat" aria-hidden="true">
        <p class="shell-ai-msg">Show me that year again.</p>
        <p class="shell-ai-msg is-bot">Here’s the moment — embedded in the medium.</p>
      </div>
      <div class="shell-ai-preview">${slot}</div>
      <div class="shell-ai-prompt" aria-hidden="true">Ask anything…</div>
    </div>
  `,

  "inset-card": (slot) => `
    <div class="shell shell-inset">
      <div class="shell-inset-card">${slot}</div>
    </div>
  `,
};

/**
 * @param {{ layout:string, chapterId:string, age:number, year:number, hint:string, multi:boolean, ariaExtra:string }} opts
 */
export function renderShellHTML(opts) {
  const slot = photoSlot(opts);
  const build = SHELLS[opts.layout] || SHELLS["inset-card"];
  return build(slot, opts);
}
