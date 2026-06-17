const worlds = {
  note: {
    title: "note",
    cards: [
      {
        title: "note記事",
        description: "日々の記録、AI活用、YouTube運用、創作のことなど。",
        link: "https://note.com/puwapononn"
      }
    ]
  },
  family: {
    title: "家族冒険ファンタジー",
    cards: [
      { title: "小説", familyNovelOpen: true },
      { title: "漫画", pending: true },
      { title: "アニメ", pending: true },
      { title: "イラスト・グッズ", pending: true }
    ]
  },
  story: {
    title: "物語・漫画の世界",
    cards: [
      {
        title: "イラスト付き短編小説",
        description: "感動、切なさ、やさしいストーリーたち。",
        pending: true
      },
      {
        title: "ラブコメ",
        description: "ドキドキと甘酸っぱい恋の物語。",
        link: "https://note.com/puwapononn/m/mb52be29315f7"
      },
      {
        title: "エッセイ漫画",
        description: "日常の小さな幸せをゆるっと描いたお話。",
        link: "https://note.com/puwapononn/m/m815855faa598"
      },
      {
        title: "四コマ漫画",
        description: "くすっと笑える、ほのぼの4コマたち。",
        link: "https://note.com/puwapononn/m/m3e50626444ef"
      }
    ]
  },
  diagnosis: {
    title: "診断の世界",
    cards: [
      {
        title: "幻想おうち診断",
        description: "あなたにぴったりの幻想のおうちを見つけます。",
        link: "https://project-yayt7.vercel.app/"
      }
    ]
  },
  goods: {
    title: "データ・グッズ販売",
    cards: [
      {
        title: "suzuri",
        link: "https://suzuri.jp/puwapononn?utm_source=others&utm_medium=social&utm_campaign=shop_share"
      },
      {
        title: "note",
        link: "https://note.com/puwapononn/m/m4c6dfcaf6b20"
      }
    ]
  },
  works: {
    title: "作品集",
    cards: pendingCards()
  },
  youtube: {
    title: "YouTube",
    cards: [
      {
        title: "ビロードの幻",
        link: "https://www.youtube.com/@VelvetPhantomJP"
      },
      {
        title: "心ときめくAIの世界",
        link: "https://www.youtube.com/@%E5%BF%83%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8FAI%E3%81%AE%E4%B8%96%E7%95%8C"
      },
      { title: "ぷわぽのん", pending: true },
      { title: "準備中" }
    ]
  }
};

const worldView = document.querySelector(".world-view");
const worldTitle = document.querySelector("#world-title");
const worldCards = document.querySelector(".world-cards");
const closeWorldButton = document.querySelector(".close-world");
const backButton = document.querySelector(".back-to-shelf");
const sparkOrigin = document.querySelector(".spark-origin");
const hotspots = document.querySelectorAll(".book-hotspot");
const pendingTopButtons = document.querySelectorAll("[data-pending-top='true']");

let sparkTimer;

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const world = worlds[hotspot.dataset.key];
    if (!world) return;

    showSpark(hotspot);
    openWorld(world);
  });
});

pendingTopButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.alert("準備中です。");
  });
});

function pendingCards() {
  return [{ title: "準備中" }, { title: "準備中" }, { title: "準備中" }, { title: "準備中" }];
}

function showSpark(hotspot) {
  const frame = hotspot.closest(".art-frame");
  const frameRect = frame.getBoundingClientRect();
  const buttonRect = hotspot.getBoundingClientRect();
  const x = ((buttonRect.left + buttonRect.width / 2 - frameRect.left) / frameRect.width) * 100;
  const y = ((buttonRect.top + buttonRect.height / 2 - frameRect.top) / frameRect.height) * 100;

  window.clearTimeout(sparkTimer);
  sparkOrigin.style.setProperty("--spark-x", `${x}%`);
  sparkOrigin.style.setProperty("--spark-y", `${y}%`);
  sparkOrigin.classList.remove("is-sparking");
  void sparkOrigin.offsetWidth;
  sparkOrigin.classList.add("is-sparking");

  sparkTimer = window.setTimeout(() => {
    sparkOrigin.classList.remove("is-sparking");
  }, 1250);
}

function openWorld(world) {
  worldTitle.textContent = world.title;
  worldCards.innerHTML = buildCards(world.cards);
  worldView.classList.remove("is-ready");
  worldView.classList.add("is-active");
  worldView.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    worldView.classList.add("is-ready");
  }, 180);
}

function buildCards(cards) {
  return normalizeCards(cards).map((card, index) => {
    const isPending = card.title === "準備中";
    const showsPendingNotice = isPending || card.pending;
    const tag = card.link ? "a" : card.familyNovelOpen ? "article" : "button";
    const href = card.link ? ` href="${card.link}"` : "";
    const type = card.link || card.familyNovelOpen ? "" : ` type="button"`;
    const pendingAction = showsPendingNotice ? ` data-pending="true"` : "";
    const familyNovelClass = card.familyNovelOpen ? " has-mini-buttons" : "";
    const className = `world-card card-${index + 1} ${isPending ? "is-pending" : ""}`;
    const description = card.description ? `<p>${card.description}</p>` : "";
    const familyNovelButtons = card.familyNovelOpen
      ? `
        <div class="card-button-list">
          <a class="mini-card-button" href="https://note.com/puwapononn/m/me0e90301a570">連載小説</a>
          <button class="mini-card-button" type="button" data-mini-pending="true">挿絵付き全話版</button>
        </div>
      `
      : "";

    return `
      <${tag} class="${className}${familyNovelClass}"${href}${type}${pendingAction} style="--card-delay: ${index * 90}ms">
        <h3>${card.title}</h3>
        ${description}
        ${familyNovelButtons}
      </${tag}>
    `;
  }).join("");
}

function normalizeCards(cards) {
  const normalized = [...cards].slice(0, 4);
  while (normalized.length < 4) {
    normalized.push({ title: "準備中" });
  }
  return normalized;
}

function closeWorld() {
  worldView.classList.remove("is-ready");
  worldView.classList.remove("is-active");
  worldView.setAttribute("aria-hidden", "true");
}

closeWorldButton.addEventListener("click", closeWorld);
backButton.addEventListener("click", closeWorld);

worldCards.addEventListener("click", (event) => {
  const miniPending = event.target.closest("[data-mini-pending='true']");
  if (miniPending) {
    const parentCard = miniPending.closest(".world-card");
    if (parentCard) {
      parentCard.innerHTML = "<h3>準備中</h3>";
      parentCard.classList.add("is-pending");
    }
    return;
  }

  const pendingCard = event.target.closest("[data-pending='true']");
  if (pendingCard) {
    pendingCard.innerHTML = "<h3>準備中</h3>";
    pendingCard.classList.add("is-pending");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWorld();
  }
});
