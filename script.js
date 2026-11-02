// Skill Swap scripts

const skills = [
  {
    title: 'Guitar Lessons',
    category: 'Music',
    price: 20,
    description: 'Learn chords, strumming, and your first songs.',
    provider: 'Maria S.',
    details: 'Beginner friendly. Sessions are 1 hour, in person or online. Bring your own guitar.'
  },
  {
    title: 'Web Design Basics',
    category: 'Programming',
    price: 25,
    description: 'Build your first website with HTML and CSS.',
    provider: 'Daniel K.',
    details: 'Covers layout, styling, and responsive design. Laptop required.'
  },
  {
    title: 'Python Tutoring',
    category: 'Programming',
    price: 20,
    description: 'Learn Python fundamentals and problem solving.',
    provider: 'Sam T.',
    details: 'Variables, loops, functions, and data structures. Laptop required.'
  },
  {
    title: 'Resume Review',
    category: 'Career',
    price: 0,
    description: 'Get feedback to make your resume stand out.',
    provider: 'Priya N.',
    details: 'Free 30-minute review focused on formatting, wording, and impact.'
  },
  {
    title: 'Portuguese Conversation',
    category: 'Language',
    price: 15,
    description: 'Practice speaking with a native speaker.',
    provider: 'Joao M.',
    details: 'Casual conversation practice for all levels. Focus on everyday vocabulary and pronunciation.'
  },
  {
    title: 'Soccer Training',
    category: 'Sports',
    price: 30,
    description: 'Improve your passing, dribbling, and fitness.',
    provider: 'Alex R.',
    details: 'Drills for all levels, focused on technique and game awareness. Cleats recommended.'
  }
];

const cardContainer = document.getElementById('card-container');
const filterBar = document.getElementById('filter-bar');

function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price} / hour`;
}

function renderSkills(list, container, emptyText) {
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-message">${emptyText}</p>`;
    return;
  }

  container.innerHTML = list
    .map(
      (skill) => `
        <article class="skill-card">
          <h3>${skill.title}</h3>
          <p class="description">${skill.description}</p>
          <p class="price">${formatPrice(skill.price)}</p>
          <p class="provider">Provider: ${skill.provider}</p>
          <div class="details">
            <p>${skill.details}</p>
          </div>
        </article>`
    )
    .join('');
}

// Toggle expand/collapse on a skill card (event delegation so it works after re-render)
function enableCardToggle(container) {
  container.addEventListener('click', (event) => {
    const card = event.target.closest('.skill-card');
    if (card) {
      card.classList.toggle('expanded');
    }
  });
}

// ===== Filter buttons =====
filterBar.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;

  filterBar.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');

  renderSkills(
    filterSkillsByCategory(skills, button.dataset.category),
    cardContainer,
    'No skills found in this category.'
  );
});

// ===== Find My Match =====
const matchCategory = document.getElementById('match-category');
const matchMaxPrice = document.getElementById('match-max-price');
const matchBtn = document.getElementById('match-btn');
const matchMessage = document.getElementById('match-message');
const matchResults = document.getElementById('match-results');

matchBtn.addEventListener('click', () => {
  const maxPrice = parseFloat(matchMaxPrice.value);

  if (Number.isNaN(maxPrice) || maxPrice < 0) {
    matchMessage.textContent = 'Please enter a max price of 0 or more.';
    matchMessage.classList.add('error');
    matchResults.innerHTML = '';
    return;
  }

  const userNeeds = { category: matchCategory.value, maxPrice };
  const matches = matchSkillsToUser(userNeeds, skills);

  matchMessage.classList.remove('error');
  matchMessage.textContent =
    matches.length === 1 ? '1 match found' : `${matches.length} matches found`;

  renderSkills(matches, matchResults, 'No skills match your needs. Try a higher budget or another category.');
});

// ===== Cost calculator =====
const rateInput = document.getElementById('rate-input');
const hoursInput = document.getElementById('hours-input');
const calcBtn = document.getElementById('calc-btn');
const calcResult = document.getElementById('calc-result');

calcBtn.addEventListener('click', () => {
  const rate = parseFloat(rateInput.value);
  const hours = parseFloat(hoursInput.value);

  if (Number.isNaN(rate) || Number.isNaN(hours) || rate < 0 || hours < 0) {
    calcResult.textContent = 'Please enter a valid rate and number of hours (0 or more).';
    calcResult.classList.add('error');
    return;
  }

  const total = calculateTotalCost(rate, hours);
  calcResult.classList.remove('error');
  calcResult.textContent = total === 0 ? 'Total cost: Free' : `Total cost: $${total.toFixed(2)}`;
});

// ===== Init =====
enableCardToggle(cardContainer);
enableCardToggle(matchResults);
renderSkills(skills, cardContainer, 'No skills found in this category.');