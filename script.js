const DOG_TABLE = {0:[0,0,0],1:[15,15,15],2:[24,24,24],3:[28,28,28],4:[32,32,32],5:[36,37,40],6:[40,42,45],7:[44,47,50],8:[48,51,55],9:[52,56,61],10:[56,60,66],11:[60,65,72],12:[64,69,77],13:[68,74,82],14:[72,78,88],15:[76,83,93]};
const CAT_TABLE = {0:0,1:15,2:24,3:28,4:32,5:36,6:40,7:44,8:48,9:52,10:56,11:60,12:64,13:68,14:72,15:76,16:80,17:84,18:88,19:92,20:96};
const SIZE_INDEX = {small:0,medium:1,large:2};
function dogYearsToHuman(totalYears, size) {
    if (totalYears <= 0) return 0;
    if (totalYears <= 0.5) return Math.round(totalYears * 20);
    if (totalYears < 1) return Math.round(10 + (totalYears - 0.5) * 10);
    const cap = Math.min(totalYears, 15);
    const low = Math.floor(cap);
    const high = Math.min(low + 1, 15);
    const frac = cap - low;
    const si = SIZE_INDEX[size];
    return Math.round(DOG_TABLE[low][si] + frac * (DOG_TABLE[high][si] - DOG_TABLE[low][si]));
}
function catYearsToHuman(totalYears) {
    if (totalYears <= 0) return 0;
    if (totalYears <= 0.5) return Math.round(totalYears * 20);
    if (totalYears < 1) return Math.round(10 + (totalYears - 0.5) * 10);
    const cap = Math.min(totalYears, 20);
    const low = Math.floor(cap);
    const high = Math.min(low + 1, 20);
    const frac = cap - low;
    return Math.round((CAT_TABLE[low] ?? 96) + frac * ((CAT_TABLE[high] ?? 96) - (CAT_TABLE[low] ?? 96)));
}
function dogLifeStage(years, size) {
    const seniorAt = {small:10,medium:9,large:8};
    if (years < 0.5) return 'Puppy';
    if (years < 1.5) return 'Junior';
    if (years < seniorAt[size] * 0.5) return 'Adult';
    if (years < seniorAt[size]) return 'Mature Adult';
    return 'Senior';
}
function catLifeStage(years) {
    if (years < 1) return 'Kitten';
    if (years <= 6) return 'Young Adult';
    if (years <= 10) return 'Mature Adult';
    return 'Senior';
}
let petType = 'dog';
let dogSize = 'small';
function selectPet(type) {
    petType = type;
    ['dog','cat'].forEach(t => {
        const b = document.getElementById('btn-' + t);
        b.classList.toggle('active', t === type);
        b.setAttribute('aria-pressed', String(t === type));
    });
    document.getElementById('size-field').classList.toggle('hidden', type === 'cat');
    hideResult();
}
function selectSize(size) {
    dogSize = size;
    ['small','medium','large'].forEach(s => {
        const b = document.getElementById('size-' + s);
        b.classList.toggle('active', s === size);
        b.setAttribute('aria-pressed', String(s === size));
    });
}
function hideResult() {
    document.getElementById('result-card').classList.remove('visible');
    document.getElementById('error-msg').style.display = 'none';
}
function syncUrlParams() {
    const url = new URL(window.location.href);
    url.searchParams.set('type', petType);
    url.searchParams.set('years', document.getElementById('age-years').value || '0');
    url.searchParams.set('months', document.getElementById('age-months').value || '0');
    if (petType === 'dog') {
        url.searchParams.set('size', dogSize);
    } else {
        url.searchParams.delete('size');
    }
    window.history.replaceState({}, '', url);
}
function calculate() {
    const yearsVal = parseFloat(document.getElementById('age-years').value);
    const monthsVal = parseInt(document.getElementById('age-months').value) || 0;
    if (isNaN(yearsVal) || yearsVal < 0 || (yearsVal === 0 && monthsVal === 0)) {
        document.getElementById('error-msg').style.display = 'block';
        document.getElementById('result-card').classList.remove('visible');
        return;
    }
    document.getElementById('error-msg').style.display = 'none';
    const totalYears = yearsVal + monthsVal / 12;
    const humanAge = petType === 'dog' ? dogYearsToHuman(totalYears, dogSize) : catYearsToHuman(totalYears);
    const stage = petType === 'dog' ? dogLifeStage(totalYears, dogSize) : catLifeStage(totalYears);
    const petYearStr = (yearsVal > 0 && monthsVal > 0) ? `${yearsVal}y ${monthsVal}m` : yearsVal > 0 ? `${yearsVal} year${yearsVal !== 1 ? 's' : ''}` : `${monthsVal} month${monthsVal !== 1 ? 's' : ''}`;
    const sizeLbs = {small:'≤20 lbs',medium:'21–50 lbs',large:'>50 lbs'}[dogSize];
    const contextD = `Life stage (Appendix B): ${stage}. As a ${dogSize} dog (${sizeLbs}), age is based on the size-adjusted table from the Dog Owner's Home Veterinary Handbook.`;
    const contextC = `Life stage: ${stage}. Based on the companion feline age table — cats reach this stage at ${stage === 'Kitten' ? 'birth–1 year' : stage === 'Young Adult' ? '1–6 years' : stage === 'Mature Adult' ? '7–10 years' : 'over 10 years'}.`;
    document.getElementById('result-label').innerHTML = `${petType === 'dog' ? 'Your dog' : 'Your cat'} (${petYearStr}) is equivalent to`;
    document.getElementById('result-number').innerHTML = humanAge;
    document.getElementById('result-context').innerHTML = petType === 'dog' ? contextD : contextC;
    setTimeout(() => document.getElementById('result-card').classList.add('visible'), 10);
    setTimeout(() => document.getElementById('result-card').scrollIntoView({behavior:'smooth',block:'nearest'}), 80);
    syncUrlParams();
}
function initializeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') === 'cat' ? 'cat' : 'dog';
    const years = params.get('years');
    const months = params.get('months');
    const size = ['small','medium','large'].includes(params.get('size')) ? params.get('size') : 'small';
    selectPet(type);
    if (type === 'dog') {
        selectSize(size);
    }
    if (years !== null) {
        document.getElementById('age-years').value = years;
    }
    if (months !== null) {
        document.getElementById('age-months').value = months;
    }
    if ((years !== null && years !== '0') || (months !== null && months !== '0')) {
        calculate();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('age-years').addEventListener('keydown', e => {
        if (e.key === 'Enter') calculate();
    });
    document.getElementById('copy-year').textContent = new Date().getFullYear();
    initializeFromUrl();
});
function openModal(id) {
    closeModal();
    document.getElementById('modal-backdrop').classList.add('open');
    document.getElementById('modal-' + id).classList.add('open');
    document.body.style.overflow = 'hidden';
    const m = document.getElementById('modal-' + id);
    const f = m.querySelector('button, a, input');
    if (f) f.focus();
}
function closeModal() {
    document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
