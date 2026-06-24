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

function formatTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime}〜${endTime}`;
  }

  if (startTime) {
    return `${startTime}〜`;
  }

  if (endTime) {
    return `〜${endTime}`;
  }

  return "時間未定";
}

function escapeHtml(value) {
  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => escapeMap[character],
  );
}

function renderEventsPage() {
  const events = [...mockData.events].sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate),
  );

  const eventCards = events
    .map((event) => {
      const participantCount = event.participantIds.length;
      const eventName = escapeHtml(event.eventName);
      const location = escapeHtml(event.location || "会場未定");

      return `
        <button
          class="event-row"
          type="button"
          data-event-id="${event.eventId}"
        >
          <div class="event-date-block">
            <span class="event-date">${formatEventDate(event.eventDate)}</span>
            <span class="event-time">
              ${formatTimeRange(event.startTime, event.endTime)}
            </span>
          </div>

          <div class="event-main">
            <strong class="event-name">${eventName}</strong>
            <span class="event-location">📍 ${location}</span>
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

function renderEventCreatePage() {
  pageTitle.textContent = "開催日を追加";
  pageDescription.textContent =
    "開催情報と参加予定者を登録します。";

  createEventButton.hidden = true;

  navItems.forEach((navItem) => {
    navItem.classList.toggle(
      "is-active",
      navItem.dataset.route === "events",
    );
  });

  const participantOptions = mockData.users
    .map(
      (user) => `
        <label class="participant-option">
          <input
            type="checkbox"
            name="participantIds"
            value="${user.userId}"
          >
          <span>${escapeHtml(user.displayName)}</span>
        </label>
      `,
    )
    .join("");

  appView.innerHTML = `
    <section class="card form-card">
      <div class="card-header">
        <div>
          <p class="section-eyebrow">CREATE EVENT</p>
          <h3 class="card-title">開催日作成</h3>
        </div>

        <p class="card-description">
          保存すると仮データへ追加され、開催日一覧へ反映されます。
        </p>
      </div>

      <form id="event-create-form" class="event-form">
        <div class="form-grid">
          <label class="form-field">
            <span class="form-label">
              開催日
              <span class="required-mark">必須</span>
            </span>

            <input
              name="eventDate"
              type="date"
              required
            >
          </label>

          <label class="form-field">
            <span class="form-label">開始時刻</span>

            <input
              name="startTime"
              type="time"
            >
          </label>

          <label class="form-field">
            <span class="form-label">終了時刻</span>

            <input
              name="endTime"
              type="time"
            >
          </label>

          <label class="form-field form-field-full">
            <span class="form-label">
              開催名
              <span class="required-mark">必須</span>
            </span>

            <input
              name="eventName"
              type="text"
              placeholder="例：2026年7月ダーツ部"
              required
            >
          </label>

          <label class="form-field form-field-full">
            <span class="form-label">会場</span>

            <input
              name="location"
              type="text"
              placeholder="例：社内ダーツスペース"
            >
          </label>
        </div>

        <fieldset class="participant-fieldset">
          <legend class="form-label">参加予定者</legend>

          <div class="participant-options">
            ${participantOptions}
          </div>
        </fieldset>

        <div class="form-actions">
          <button
            id="cancel-event-create"
            class="button button-secondary"
            type="button"
          >
            キャンセル
          </button>

          <button
            class="button button-primary"
            type="submit"
          >
            開催日を保存
          </button>
        </div>
      </form>
    </section>
  `;

  const eventCreateForm = document.querySelector("#event-create-form");
  const cancelButton = document.querySelector("#cancel-event-create");

  cancelButton.addEventListener("click", () => {
    renderRoute("events");
  });

  eventCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(eventCreateForm);

    const eventDate = String(formData.get("eventDate") || "");
    const eventName = String(formData.get("eventName") || "").trim();
    const startTime = String(formData.get("startTime") || "");
    const endTime = String(formData.get("endTime") || "");
    const location = String(formData.get("location") || "").trim();

    if (!eventDate || !eventName) {
      window.alert("開催日と開催名を入力してください。");
      return;
    }

    const participantIds = [
      ...document.querySelectorAll(
        'input[name="participantIds"]:checked',
      ),
    ].map((input) => input.value);

    const newEvent = {
      eventId: `evt_${Date.now()}`,
      eventDate,
      eventName,
      startTime,
      endTime,
      location,
      participantIds,
    };

    mockData.events.push(newEvent);

    renderRoute("events");

    window.alert(
      `「${newEvent.eventName}」を仮データとして追加しました。\nブラウザを再読み込みすると、今回の追加内容は消えます。`,
    );
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
  renderEventCreatePage();
});

renderRoute("events");