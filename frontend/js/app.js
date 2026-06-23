"use strict";

const appView = document.querySelector("#app-view");
const pageTitle = document.querySelector("#page-title");
const pageDescription = document.querySelector("#page-description");
const createEventButton = document.querySelector("#create-event-button");
const navItems = document.querySelectorAll(".nav-item");

const pageMetadata = {
  home: {
    title: "ホーム",
    description: "直近の成績や、部活内での順位を確認します。",
  },
  events: {
    title: "開催日一覧",
    description: "開催日を選択して、ゲーム結果の確認・入力を行います。",
  },
  ranking: {
    title: "01ランキング",
    description: "全期間の01平均スタッツを確認します。",
  },
  player: {
    title: "個人成績",
    description: "自分や部員の戦績・成長を確認します。",
  },
};

function formatEventDate(eventDate) {
  const date = new Date(`${eventDate}T00:00:00+09:00`);

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

function renderEventsPage() {
  const events = [...mockData.events].sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate),
  );

  const eventCards = events
    .map((event) => {
      const participantCount = event.participantIds.length;

      return `
        <button
          class="event-row"
          type="button"
          data-event-id="${event.eventId}"
        >
          <div class="event-date-block">
            <span class="event-date">${formatEventDate(event.eventDate)}</span>
            <span class="event-time">${event.startTime}〜${event.endTime}</span>
          </div>

          <div class="event-main">
            <strong class="event-name">${event.eventName}</strong>
            <span class="event-location">📍 ${event.location}</span>
          </div>

          <div class="event-meta">
            <span>${participantCount}名</span>
            <span class="event-arrow">›</span>
          </div>
        </button>
      `;
    })
    .join("");

  appView.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <p class="section-eyebrow">EVENTS</p>
          <h3 class="card-title">開催日一覧</h3>
        </div>

        <p class="card-description">
          開催日を選択すると、その日のゲーム結果を確認できます。
        </p>
      </div>

      <div class="event-list">
        ${eventCards}
      </div>
    </section>
  `;

  document.querySelectorAll("[data-event-id]").forEach((eventButton) => {
    eventButton.addEventListener("click", () => {
      const selectedEvent = mockData.events.find(
        (event) => event.eventId === eventButton.dataset.eventId,
      );

      window.alert(
        `「${selectedEvent.eventName}」の開催日詳細画面は、次に実装します。`,
      );
    });
  });
}

function renderPlaceholderPage(route) {
  const metadata = pageMetadata[route];

  appView.innerHTML = `
    <section class="card placeholder-card">
      <div class="card-body">
        <p class="section-eyebrow">COMING SOON</p>
        <h3 class="card-title">${metadata.title}</h3>
        <p class="placeholder-text">
          この画面は、開催日一覧と01結果入力の縦切り完成後に実装します。
        </p>
      </div>
    </section>
  `;
}

function renderRoute(route) {
  const metadata = pageMetadata[route];

  pageTitle.textContent = metadata.title;
  pageDescription.textContent = metadata.description;

  createEventButton.hidden = route !== "events";

  navItems.forEach((navItem) => {
    navItem.classList.toggle(
      "is-active",
      navItem.dataset.route === route,
    );
  });

  if (route === "events") {
    renderEventsPage();
    return;
  }

  renderPlaceholderPage(route);
}

navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    renderRoute(navItem.dataset.route);
  });
});

createEventButton.addEventListener("click", () => {
  window.alert("開催日作成画面は、次に実装します。");
});

renderRoute("events");