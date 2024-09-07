let checkBonus = {};
let weightKey = {};
let bonusKey = {};
async function preloadRules() {
    try {
        const response = await fetch('rules.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        checkBonus = data.checkBonus || {};
        weightKey = (data.weightKey || []).reduce((acc, item) => {
            acc[item.name] = item.weight;
            return acc;
        }, {});
        bonusKey = (data.specialBonus || []).reduce((acc, item) => {
            acc[item.name] = item.point;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading rules.json:', error);
    }
}
preloadRules();
var $ = {
    q: (e) => document.querySelector(e),
    qa: (e) => document.querySelectorAll(e),
    l: (e, s = document, ...h) => {
        s.addEventListener(e, (event) => {
            h.forEach(h => h(event));
        });
    },
    rl: (e, s = document, ...h) => {
        s.removeEventListener(e, (event) => {
            h.forEach(h => h(event));
        })
    },
    s: (el, attrs) => {
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.setAttribute(key, attrs[key]);
            }
        }
    },
    c: (e, i, p, ns, attrs) => {
        var el = ns ? document.createElementNS(ns, e) : document.createElement(e);
        if (i)
            el[(e === "img" || e === "video" || e === "audio") ? "src" : "innerHTML"] = i;
        if (p)
            p.append(el);
        if (e === "img")
            el.draggable = false;
        if (attrs)
            $.s(el, attrs);
        return el;
    }
};
(function() {
    const handleClick = (event) => {
        const target = event.target;
        if (target.classList.contains('check')) {
            target.classList.add('checked');
            increment(target, event);
        }
    };
    const handleContextMenu = (event) => {
        const target = event.target;
        const label = target.querySelector('.counter-label');

        if (!label || parseInt(label.textContent) === 1) {
            target.classList.remove('checked');
        }
        decrement(target, event);
    };
    $.l('click', document, handleClick);
    $.l('contextmenu', document, handleContextMenu);
})();
function increment(el, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (e && e.shiftKey) {
        const depthLabel = el.querySelector('.depth-label');
        if (depthLabel) {
            const maxDepth = depthLabel.getAttribute('data-max');
            const currentDepth = parseInt(depthLabel.textContent);
            if (!maxDepth || currentDepth < parseInt(maxDepth)) {
                depthLabel.textContent = currentDepth + 1;
            }
        }
    } else {
        const counterLabel = el.querySelector('.counter-label');
        if (counterLabel) {
            const maxCounter = counterLabel.getAttribute('data-max');
            const currentCounter = parseInt(counterLabel.textContent);
            if (!maxCounter || currentCounter < parseInt(maxCounter)) {
                counterLabel.textContent = currentCounter + 1;
            }
        }
    }
}
function decrement(el, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (e && e.shiftKey) {
        const depthLabel = el.querySelector('.depth-label');
        if (depthLabel && parseInt(depthLabel.textContent) > 0) {
            depthLabel.textContent = parseInt(depthLabel.textContent) - 1;
        }
    } else {
        const counterLabel = el.querySelector('.counter-label');
        if (counterLabel && parseInt(counterLabel.textContent) > 0) {
            counterLabel.textContent = parseInt(counterLabel.textContent) - 1;
        }
    }
}
function selectAll(button) {
    const container = button.closest('.ban-weight');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}
function deselectAll(button) {
    const container = button.closest('.ban-weight');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = !checkbox.checked;
    });
}
function updateBG() {
    const levels = document.querySelectorAll('[class^="level"]');
    let highestCheckedLevel = 0;

    levels.forEach(level => {
        const checkedDivs = level.querySelectorAll('div.checked');
        const levelClass = level.className.match(/\d+/);

        if (levelClass && checkedDivs.length > 0) {
            const levelNumber = parseInt(levelClass[0], 10);
            if (levelNumber > highestCheckedLevel) {
                highestCheckedLevel = levelNumber;
            }
        }
    });

    if (highestCheckedLevel > 0) {
        const editor = document.getElementById('bg');
        editor.style.backgroundImage = `url('assets/HD/bg_zone_${highestCheckedLevel}.png')`;
    }
}
/*function addHole() {
    const limitedCheck = $.q('.limited-check');
    if (limitedCheck) {
        $.c('div', `
            <span class="counter-label">0</span>
            <span class="depth-label">0</span>
        `, limitedCheck, null, {
            class: 'counter-box beyond',
            onclick: 'increment(this, event)',
            oncontextmenu: 'decrement(this, event); return false;'
        });
    }
}
function rmvHole() {
    const limitedCheck = $.q('.limited-check');
    if (limitedCheck) {
        const counterBox = limitedCheck.querySelector('.counter-box.beyond');
        if (counterBox) {
            limitedCheck.removeChild(counterBox);
        }
    }
}*/
let holeCount = 0; 

function addHole() {
    const limitedCheck = $.q('.limited-check');
    const addButton = document.querySelector('button[onclick="addHole()"]'); 

    if (limitedCheck && holeCount < 5) {
        $.c('div', `
            <span class="counter-label">0</span>
            <span class="depth-label">0</span>
        `, limitedCheck, null, {
            class: 'counter-box beyond',
            onclick: 'increment(this, event)',
            oncontextmenu: 'decrement(this, event); return false;'
        });

        holeCount++; 

        if (holeCount === 5) {
            addButton.disabled = true;
        } else {
            addButton.disabled = false;
        }
    }
}

function rmvHole() {
    const limitedCheck = $.q('.limited-check');
    const addButton = document.querySelector('button[onclick="addHole()"]');
    
    if (limitedCheck) {
        const counterBox = limitedCheck.querySelector('.counter-box.beyond');
        if (counterBox) {
            limitedCheck.removeChild(counterBox);
            holeCount--; 
        }
    }

    if (holeCount < 5) {
        addButton.disabled = false;
    }

    if (holeCount <= 0) {
        holeCount = 0; 
    }
}
function getCheck() {
    const checkedNodes = document.querySelectorAll('div.checked');
    const checkInfo = Array.from(checkedNodes).map(node => {
        const counterValue = parseInt(node.querySelector('.counter-label')?.textContent || '1', 10);
        const checkboxStates = Array.from(node.querySelectorAll('input[type="checkbox"]')).map(checkbox => ({
            id: checkbox.id,
            value: checkbox.value,
            checked: checkbox.checked
        }));
        const checkname = node.querySelector('span.checkname')?.textContent.trim() || 'defaultCheckname';
        return { counterValue, checkboxStates, checkname };
    });
    const calculateBonus = checkInfo => checkInfo.reduce((totalBonus, item) => {
        const bonusItem = checkBonus.find(b => b.name === item.checkname);
        if (!bonusItem) return totalBonus;

        let itemBonus = bonusItem.baseScore;
        let noLeakBonus = 0;

        item.checkboxStates.forEach(checkbox => {
            if (checkbox.checked) {
                const conditionBonus = bonusItem.conditions[checkbox.value] || 0;
                itemBonus += checkbox.id === 'era' 
                    ? Math.max(...checkbox.value.split('/').map(value => bonusItem.conditions[value] || 0))
                    : conditionBonus;

                if (checkbox.id === 'no-leak') {
                    noLeakBonus = conditionBonus;
                }
            }
        });
        totalBonus += item.checkname === '鸭速公路'
            ? itemBonus * item.counterValue - noLeakBonus * (item.counterValue - 1)
            : itemBonus;
        return totalBonus;
    }, 0);

    return calculateBonus(checkInfo);
}
function getOperation() {
    const inputs = Array.from(document.querySelector('div.operation').querySelectorAll('input')).slice(0, 3).map(input => parseFloat(input.value));
    return (([a, b, c]) => (a > 60 ? (a - 60) * -50 : 0) + b * -15 + c * -6)(inputs);
}
function getSpecial() {
    const counterBoxes = document.querySelectorAll('.fortune .counter-box');
    const specialInfo = Array.from(counterBoxes).map(counterBox => ({
        class: counterBox.classList[1],
        value: parseInt(counterBox.querySelector('span.counter-label').textContent, 10),
        depth: parseInt(counterBox.querySelector('span.depth-label')?.textContent || 0, 10)
    }));

    return specialInfo.reduce((total, { class: cls, value, depth }) => {
        const bonus = bonusKey[cls] * value;
        return total + (cls === 'beyond' ? bonus * depth : bonus);
    }, 0);
}
function getWeight() {
    let totalWeight = 1;
    let ewStatus = 0;
    const checkedStatus = document.querySelector('.bossfight').querySelectorAll('div.checked').length > 0;
    const allSelections = Array.from(document.querySelectorAll('.ban-weight input[type="checkbox"], .ban-weight select, .ban-weight input[type="radio"]'));

    allSelections.forEach(({ id, checked, value, type }) => {
        if (type === 'radio' && checked) {
            ewStatus = (id === 'option-yes') ? -1 : (id === 'option-yee') ? 1 : ewStatus;
        } else if (type === 'checkbox' && id !== 'doctor-silver' && checked) {
            totalWeight += weightKey[id] || 0;
        } else if (type === 'select-one' && value !== 'none') {
            totalWeight += weightKey[value] || 0;
        }
    });
    if (ewStatus === -1) {
        totalWeight *= 0.8;
    } else if (ewStatus === 1) {
        totalWeight += weightKey[Object.keys(weightKey).pop()];
    }
    if (!checkedStatus) {
        return ewStatus === -1 ? '0.8000' : '1.0000';
    }
    return totalWeight.toFixed(4);
}
function calcBonus() {
    let originScore = parseFloat(document.getElementById('origin-score').value);
    let checkBonus = getCheck();
    let operationBonus = getOperation();
    let specialBonus = getSpecial();
    let weight = getWeight();

    let finalScore = (originScore + checkBonus + operationBonus + specialBonus) * weight;
    finalScore = parseFloat(finalScore.toFixed(4));
    let outputScore =`最终分数：[${originScore} + ${checkBonus} + (${operationBonus}) + ${specialBonus}) * ${weight}] = ${finalScore}`;
    $.q('.final-score').textContent = outputScore;
}
