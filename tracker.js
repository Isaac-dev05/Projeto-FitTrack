const key = 'fittrack.v1';
const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const validDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10));
};
function weeklyCount(workouts, now = new Date()) {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setDate(start.getDate() - (start.getDay() + 6) % 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return new Set(workouts.filter(w => {
        const date = new Date(`${w.date}T12:00:00`);
        return date >= start && date < end;
    }).map(w => w.date)).size;
}
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#meus-treinos');
    if (!root) return;
    const $ = id => document.getElementById(id);
    let state = { goal: 3, workouts: [] };
    const announce = message => { $('tracker-status').textContent = message; };
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (saved) {
            if (!Number.isInteger(saved.goal) || saved.goal < 1 || saved.goal > 7 || !Array.isArray(saved.workouts) || !saved.workouts.every(w => typeof w.id === 'string' && typeof w.name === 'string' && w.name.length <= 80 && validDate(w.date) && w.date <= today() && Number.isInteger(w.minutes) && w.minutes > 0 && w.minutes <= 300)) throw new Error();
            state = saved;
        }
    } catch { announce('Não foi possível carregar os dados. Você pode usar o painel nesta sessão.'); }
    function save() {
        try { localStorage.setItem(key, JSON.stringify(state)); return true; }
        catch { announce('Armazenamento indisponível: os dados ficam apenas nesta sessão.'); return false; }
    }
    function render() {
        const count = weeklyCount(state.workouts);
        $('week-count').textContent = count;
        $('total-minutes').textContent = state.workouts.reduce((sum, w) => sum + w.minutes, 0);
        $('goal').value = state.goal;
        $('week-progress').max = state.goal;
        $('week-progress').value = Math.min(count, state.goal);
        $('goal-summary').textContent = count >= state.goal ? 'Meta da semana atingida. Boa constância!' : `${count} de ${state.goal} dias nesta semana`;
        $('empty-history').hidden = state.workouts.length > 0;
        $('workout-list').replaceChildren();
        [...state.workouts].sort((a, b) => b.date.localeCompare(a.date)).forEach(w => {
            const item = document.createElement('li');
            const info = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = w.name;
            const detail = document.createElement('span');
            detail.textContent = `${new Date(`${w.date}T12:00:00`).toLocaleDateString('pt-BR')} · ${w.minutes} min`;
            info.append(title, detail);
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'secondary-btn';
            remove.textContent = 'Excluir';
            remove.setAttribute('aria-label', `Excluir ${w.name} de ${detail.textContent}`);
            remove.addEventListener('click', () => {
                if (!confirm(`Excluir o registro “${w.name}”?`)) return;
                state.workouts = state.workouts.filter(record => record.id !== w.id);
                if (save()) announce('Registro excluído.');
                render();
            });
            item.append(info, remove);
            $('workout-list').append(item);
        });
    }
    $('workout-date').value = today();
    $('workout-date').max = today();
    $('workout-form').addEventListener('submit', event => {
        event.preventDefault();
        const name = $('workout-name').value.trim();
        const date = $('workout-date').value;
        const minutes = Number($('workout-minutes').value);
        if (!name || name.length > 80 || !validDate(date) || date > today() || !Number.isInteger(minutes) || minutes < 1 || minutes > 300) { announce('Confira o nome, a data e a duração de 1 a 300 minutos.'); return; }
        state.workouts.push({ id: crypto.randomUUID(), name, date, minutes });
        if (save()) announce('Treino registrado!');
        $('workout-name').value = '';
        render();
        $('workout-name').focus();
    });
    $('goal').addEventListener('change', () => {
        state.goal = Number($('goal').value);
        if (save()) announce('Meta semanal atualizada.');
        render();
    });
    let deadline = 0;
    let remaining = 60;
    let interval;
    const display = () => { $('timer-display').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; };
    const pause = () => {
        clearInterval(interval);
        interval = undefined;
        $('timer-toggle').textContent = 'Iniciar';
        $('rest-duration').disabled = false;
    };
    $('timer-toggle').addEventListener('click', () => {
        if (interval) { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); pause(); display(); return; }
        if (remaining <= 0) remaining = Number($('rest-duration').value);
        deadline = Date.now() + remaining * 1000;
        $('timer-toggle').textContent = 'Pausar';
        $('rest-duration').disabled = true;
        interval = setInterval(() => {
            remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            display();
            if (!remaining) { pause(); announce('Descanso concluído!'); }
        }, 200);
    });
    function reset() { pause(); remaining = Number($('rest-duration').value); display(); }
    $('timer-reset').addEventListener('click', reset);
    $('rest-duration').addEventListener('change', reset);
    render();
});
