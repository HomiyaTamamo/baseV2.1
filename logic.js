document.addEventListener('DOMContentLoaded', function() {
    function initWishdaleLogic() {
        const ewRadio = document.querySelectorAll('input[name="wishdale"]');
        const banSelect = document.getElementById('ban-select');
        const DSbox = document.getElementById('doctor-silver');

        function updateDS() {
            const isThirdOptionSelected = document.getElementById('option-yee').checked;
            banSelect.selectedIndex = 0;
            banSelect.disabled = isThirdOptionSelected;
            DSbox.disabled = isThirdOptionSelected;
        }

        ewRadio.forEach(radio => radio.addEventListener('change', updateDS));
        updateDS();
    }
    function initBossfightLogic() {
        const checks = document.querySelectorAll('.bossfight .check');

        checks.forEach(check => {
            check.addEventListener('click', () => {
                checks.forEach(c => c.classList.remove('checked'));
                check.classList.add('checked');
            });
        });
    }
    function initBanLogic() {
        const banSelect = document.getElementById('ban-select');
        const DSbox = document.getElementById('doctor-silver');
        const allCheckboxes = document.querySelectorAll('.ban-weight input[type="checkbox"]');

        function updateBan() {
            const selectedValue = banSelect.value;
            allCheckboxes.forEach(checkbox => {
                if (checkbox.id !== 'doctor-silver') {
                    checkbox.disabled = checkbox.id === selectedValue && !DSbox.checked;
                    if (checkbox.disabled) checkbox.checked = false;
                }
            });
        }

        banSelect.addEventListener('change', updateBan);
        DSbox.addEventListener('change', updateBan);

        allCheckboxes.forEach(checkbox => {
            if (checkbox.id !== 'doctor-silver') {
                checkbox.addEventListener('change', function() {
                    if (checkbox.id === banSelect.value && !DSbox.checked) {
                        checkbox.checked = false;
                        checkbox.disabled = true;
                    }
                });
            }
        });
    }
    function initChaosLogic() {
        const chaosCheckboxes = document.querySelectorAll('input[type="checkbox"][value="混乱"]');

        chaosCheckboxes.forEach(chaosCheckbox => {
            const noLeakCheckbox = chaosCheckbox.nextElementSibling.nextElementSibling;
            if (noLeakCheckbox && noLeakCheckbox.value === "无漏") {
                chaosCheckbox.addEventListener('change', function() {
                    noLeakCheckbox.disabled = !this.checked;
                    if (!this.checked) noLeakCheckbox.checked = false;
                });
                noLeakCheckbox.disabled = !chaosCheckbox.checked;
            }
        });
    }
    initWishdaleLogic();
    initBossfightLogic();
    initBanLogic();
    initChaosLogic();
});