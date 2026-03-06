/* ═══════════════════════════════════════════════════════════════
   ReelEstate Orlando — Private Client Booking Portal
   Calendar + Booking Logic
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Config ──
    const SESSION_RATE = 460;
    const DEPOSIT_AMOUNT = 230;
    const FINAL_AMOUNT = SESSION_RATE - DEPOSIT_AMOUNT;
    const SQUARE_DEPOSIT_LINK = 'https://square.link/u/WXhmDXxo';
    const SQUARE_FINAL_LINK = 'https://square.link/u/gMAbdObG';

    // ── State ──
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;

    // ── DOM refs ──
    const calGrid = document.getElementById('calGrid');
    const calMonth = document.getElementById('calMonth');
    const prevBtn = document.getElementById('calPrev');
    const nextBtn = document.getElementById('calNext');
    const summaryPlaceholder = document.getElementById('summaryPlaceholder');
    const summaryDetails = document.getElementById('summaryDetails');
    const summaryDateText = document.getElementById('summaryDate');
    const depositBtn = document.getElementById('depositBtn');
    const finalBtn = document.getElementById('finalBtn');

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // ── Calendar Rendering ──
    function renderCalendar() {
        calMonth.textContent = MONTHS[currentMonth] + ' ' + currentYear;

        // Clear grid (keep only day-of-week headers)
        const existing = calGrid.querySelectorAll('.cal-day');
        existing.forEach(el => el.remove());

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day cal-day--empty';
            calGrid.appendChild(empty);
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const cell = document.createElement('div');
            cell.className = 'cal-day';
            cell.textContent = d;

            const isPast = date < today;
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate &&
                selectedDate.getDate() === d &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

            if (isPast) {
                cell.classList.add('cal-day--disabled');
            } else {
                if (isToday) cell.classList.add('cal-day--today');
                if (isSelected) cell.classList.add('cal-day--selected');

                cell.addEventListener('click', function () {
                    selectDate(new Date(currentYear, currentMonth, d));
                });
            }

            calGrid.appendChild(cell);
        }
    }

    // ── Date Selection ──
    function selectDate(date) {
        selectedDate = date;
        renderCalendar(); // Re-render to update selection highlight

        // Update summary
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        const formatted = date.toLocaleDateString('en-US', options);
        summaryDateText.textContent = formatted;

        // Show details, hide placeholder
        summaryPlaceholder.style.display = 'none';
        summaryDetails.classList.add('is-visible');

        // Enable deposit button
        depositBtn.classList.remove('c-deposit-btn--disabled');
        depositBtn.removeAttribute('aria-disabled');
        depositBtn.href = SQUARE_DEPOSIT_LINK;

        // Enable final payment button
        finalBtn.classList.remove('c-deposit-btn--disabled');
        finalBtn.removeAttribute('aria-disabled');
        finalBtn.href = SQUARE_FINAL_LINK;
    }

    // ── Navigation ──
    prevBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // ── Deposit Button Guard ──
    depositBtn.addEventListener('click', function (e) {
        if (!selectedDate || this.classList.contains('c-deposit-btn--disabled')) {
            e.preventDefault();
            // Gentle shake animation
            this.style.animation = 'none';
            void this.offsetHeight; // reflow
            this.style.animation = 'shake 0.4s ease';
            return;
        }

    });

    // ── Final Payment Button Guard ──
    finalBtn.addEventListener('click', function (e) {
        if (!selectedDate || this.classList.contains('c-deposit-btn--disabled')) {
            e.preventDefault();
            this.style.animation = 'none';
            void this.offsetHeight;
            this.style.animation = 'shake 0.4s ease';
            return;
        }
    });

    // Shake animation (injected once)
    const style = document.createElement('style');
    style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
    document.head.appendChild(style);

    // ── Init ──
    renderCalendar();
})();
