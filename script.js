// Skill Swap scripts

// Skills now come from the backend API instead of a hardcoded array
let skills = [];

const cardContainer = document.getElementById('card-container');
const filterBar = document.getElementById('filter-bar');
const skillsStatus = document.getElementById('skills-status');

function formatPrice(price) {
  return Number(price) === 0 ? 'Free' : `$${price} / hour`;
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
            <p>${skill.details || `Offered by ${skill.provider}. Category: ${skill.category}.`}</p>
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

// ===== Load skills from the API =====
function renderCurrentFilter() {
  const activeBtn = filterBar.querySelector('.filter-btn.active');
  const category = activeBtn ? activeBtn.dataset.category : 'All';
  renderSkills(
    filterSkillsByCategory(skills, category),
    cardContainer,
    'No skills found in this category.'
  );
}

async function loadSkills() {
  skillsStatus.classList.remove('error');
  skillsStatus.textContent = 'Loading skills...';
  try {
    skills = await window.apiService.fetchSkills();
    skillsStatus.textContent = '';
    renderCurrentFilter();
  } catch (error) {
    skillsStatus.classList.add('error');
    skillsStatus.textContent =
      'Could not load skills. Make sure the backend is running on http://localhost:3000.';
    cardContainer.innerHTML = '';
  }
}

// ===== Filter buttons =====
filterBar.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;

  filterBar.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');

  renderCurrentFilter();
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

// ===== Add skill form =====
const skillForm = document.getElementById('skill-form');
const formMessage = document.getElementById('form-message');

skillForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const price = parseFloat(document.getElementById('skill-price').value);
  if (Number.isNaN(price) || price < 0) {
    formMessage.textContent = 'Please enter a price of 0 or more.';
    formMessage.classList.add('error');
    return;
  }

  const skillData = {
    title: document.getElementById('skill-title').value.trim(),
    category: document.getElementById('skill-category').value,
    price,
    provider: document.getElementById('skill-provider').value.trim(),
    description: document.getElementById('skill-description').value.trim()
  };

  formMessage.classList.remove('error');
  formMessage.textContent = 'Saving...';

  try {
    await window.apiService.createSkill(skillData);
    skillForm.reset();
    formMessage.textContent = 'Skill added!';
    await loadSkills();
  } catch (error) {
    formMessage.classList.add('error');
    formMessage.textContent = 'Could not add skill. Please try again.';
  }
});

// ===== Init =====
enableCardToggle(cardContainer);
enableCardToggle(matchResults);
loadSkills();