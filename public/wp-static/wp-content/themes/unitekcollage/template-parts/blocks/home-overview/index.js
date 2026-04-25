// Home Overview Stats Expand/Collapse Functionality
function toggleStatExpand(index) {
    const stat = document.querySelector('.home-overview-stat[data-stat-index="' + index + '"]');
    if (!stat) return;
    
    const description = stat.querySelector('.home-overview-stat-description');
    if (!description) return;
    
    const isExpanded = stat.classList.contains('expanded');
    
    // Close all other stats on click
    document.querySelectorAll('.home-overview-stat').forEach(function(otherStat) {
        if (otherStat !== stat) {
            otherStat.classList.remove('expanded');
            const otherDesc = otherStat.querySelector('.home-overview-stat-description');
            if (otherDesc) {
                otherDesc.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Toggle current stat
    if (isExpanded) {
        stat.classList.remove('expanded');
        description.setAttribute('aria-expanded', 'false');
    } else {
        stat.classList.add('expanded');
        description.setAttribute('aria-expanded', 'true');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const statDescriptions = document.querySelectorAll('.home-overview-stat-description');
    
    statDescriptions.forEach(function(desc) {
        const stat = desc.closest('.home-overview-stat');
        const index = stat.getAttribute('data-stat-index');
        
        // Click handler
        desc.addEventListener('click', function(e) {
            e.preventDefault();
            toggleStatExpand(index);
        });
        
        // Keyboard navigation
        desc.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleStatExpand(index);
            }
        });
    });
});

