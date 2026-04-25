// Healthcare Programs Tab Data (Global scope for admin compatibility)
window.healthcareTabsData = [];
window.healthcareInitialized = false;

// Initialize tab data from PHP (Global function)
window.initHealthcareTabsData = function(data) {
    window.healthcareTabsData = data;
    
    // If DOM is already ready, initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHealthcareEventListeners);
    } else {
        initHealthcareEventListeners();
    }
};

// Tab switching function (Global function)
window.switchHealthcareTab = function(tabIndex) {
    // Update tab active states
    const tabs = document.querySelectorAll('.healthcare-tab');
    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Get tab data
    const tabData = window.healthcareTabsData[tabIndex];
    if (!tabData) return;
    
    // Update program details with show/hide
    const programHeadlineContainer = document.querySelector('.healthcare-program-headline');
    const programHeadline = document.querySelector('.tab-program-headline');
    const programDescription = document.querySelector('.tab-program-description');
    const nclexLabel = document.querySelector('.tab-nclex-label');
    const nclexRate = document.querySelector('.tab-nclex-rate');
    const nclexSource = document.querySelector('.tab-nclex-source');
    
    if (programHeadlineContainer) {
        programHeadlineContainer.style.display = tabData.tab_program_headline ? '' : 'none';
    }
    if (programHeadline) {
        programHeadline.textContent = tabData.tab_program_headline || '';
    }
    if (programDescription) {
        programDescription.textContent = tabData.tab_program_description || '';
        programDescription.style.display = tabData.tab_program_description ? '' : 'none';
    }
    if (nclexLabel) {
        nclexLabel.textContent = tabData.tab_nclex_label || '';
        nclexLabel.style.display = tabData.tab_nclex_label ? '' : 'none';
    }
    if (nclexRate) {
        nclexRate.textContent = tabData.tab_nclex_rate || '';
        nclexRate.style.display = tabData.tab_nclex_rate ? '' : 'none';
    }
    if (nclexSource) {
        nclexSource.textContent = tabData.tab_nclex_source || '';
        nclexSource.style.display = tabData.tab_nclex_source ? '' : 'none';
    }
    
    // Update testimonial with show/hide
    const testimonialCard = document.querySelector('.healthcare-testimonial-card');
    const testimonialQuote = document.querySelector('.healthcare-testimonial-quote');
    const testimonialText = document.querySelector('.tab-testimonial-text');
    const testimonialAuthor = document.querySelector('.healthcare-testimonial-author');
    const testimonialName = document.querySelector('.tab-testimonial-name');
    const testimonialTitle = document.querySelector('.tab-testimonial-title');
    
    const hasTestimonialContent = tabData.tab_testimonial_text || tabData.tab_testimonial_name || tabData.tab_testimonial_title;
    
    if (testimonialCard) {
        testimonialCard.style.display = hasTestimonialContent ? '' : 'none';
    }
    if (testimonialQuote) {
        testimonialQuote.style.display = tabData.tab_testimonial_text ? '' : 'none';
    }
    if (testimonialText) {
        testimonialText.textContent = tabData.tab_testimonial_text || '';
        testimonialText.style.display = tabData.tab_testimonial_text ? '' : 'none';
    }
    if (testimonialAuthor) {
        testimonialAuthor.style.display = (tabData.tab_testimonial_name || tabData.tab_testimonial_title) ? '' : 'none';
    }
    if (testimonialName) {
        testimonialName.textContent = tabData.tab_testimonial_name || '';
        testimonialName.style.display = tabData.tab_testimonial_name ? '' : 'none';
    }
    if (testimonialTitle) {
        testimonialTitle.textContent = tabData.tab_testimonial_title || '';
        testimonialTitle.style.display = tabData.tab_testimonial_title ? '' : 'none';
    }
    
    // Update testimonial card background image
    if (testimonialCard) {
        const testimonialBgImage = tabData.tab_testimonial_background_image;
        if (testimonialBgImage && testimonialBgImage.url) {
            testimonialCard.style.backgroundImage = `url('${testimonialBgImage.url}')`;
            testimonialCard.style.backgroundSize = 'cover';
            testimonialCard.style.backgroundPosition = 'center';
            testimonialCard.style.backgroundRepeat = 'no-repeat';
        } else {
            // Remove background image if not set for this tab
            testimonialCard.style.backgroundImage = '';
        }
    }
    
    // Update learn more link
    const learnMoreLink = document.querySelector('.healthcare-learn-more');
    if (learnMoreLink && tabData.tab_learn_more_link) {
        learnMoreLink.href = tabData.tab_learn_more_link;
        learnMoreLink.style.display = 'inline-flex';
    } else if (learnMoreLink) {
        learnMoreLink.style.display = 'none';
    }
    
    // Update read more link
    const readMoreLink = document.querySelector('.healthcare-testimonial-read-more a');
    if (readMoreLink && tabData.tab_read_more_link) {
        readMoreLink.href = tabData.tab_read_more_link;
        readMoreLink.parentElement.style.display = 'block';
    } else if (readMoreLink) {
        readMoreLink.parentElement.style.display = 'none';
    }
    
    // Update video placeholder
    const videoPlaceholder = document.querySelector('.healthcare-video-placeholder');
    const videoPlay = document.querySelector('.healthcare-video-play');
    
    // Check if we have a video file or URL
    const hasVideoFile = tabData.tab_video_file && tabData.tab_video_file.url;
    const hasVideoUrl = tabData.tab_video_url;
    const videoSource = hasVideoFile ? tabData.tab_video_file.url : (hasVideoUrl ? tabData.tab_video_url : '');
    const isUploadedVideo = hasVideoFile ? true : false;
    
    // Get thumbnail URL for the video (Priority order: Custom > Auto-generated)
    let thumbnailUrl = '';
    
    // Priority 1: Check for custom thumbnail field
    if (tabData.tab_video_thumbnail && tabData.tab_video_thumbnail.url) {
        thumbnailUrl = tabData.tab_video_thumbnail.url;
    }
    // Priority 2: Check video file metadata
    else if (hasVideoFile && tabData.tab_video_file.thumbnail) {
        thumbnailUrl = tabData.tab_video_file.thumbnail;
    }
    // Priority 3: Auto-generate for YouTube/Vimeo
    else if (hasVideoUrl) {
        if (videoSource.includes('youtube.com') || videoSource.includes('youtu.be')) {
            const youtubeMatch = videoSource.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            if (youtubeMatch && youtubeMatch[1]) {
                thumbnailUrl = 'https://img.youtube.com/vi/' + youtubeMatch[1] + '/maxresdefault.jpg';
            }
        } else if (videoSource.includes('vimeo.com')) {
            // For Vimeo, we'd need an API call, so just show placeholder
            thumbnailUrl = '';
        }
    }
    
    if (videoPlaceholder) {
        videoPlaceholder.style.display = videoSource ? '' : 'none';
        videoPlaceholder.setAttribute('data-is-uploaded', isUploadedVideo ? '1' : '0');
        
        // Update background image (thumbnail)
        if (thumbnailUrl) {
            videoPlaceholder.style.backgroundImage = `url('${thumbnailUrl}')`;
            videoPlaceholder.style.backgroundSize = 'cover';
            videoPlaceholder.style.backgroundPosition = 'center';
            videoPlaceholder.style.backgroundRepeat = 'no-repeat';
        } else {
            videoPlaceholder.style.backgroundImage = '';
        }
    }
    
    if (videoPlay) {
        if (videoSource) {
            videoPlay.setAttribute('data-video-url', videoSource);
            videoPlay.setAttribute('data-is-uploaded', isUploadedVideo ? '1' : '0');
            videoPlay.onclick = function() { openHealthcareVideoModal(videoSource, isUploadedVideo); };
            videoPlay.style.display = '';
        } else {
            videoPlay.onclick = null;
            videoPlay.style.display = 'none';
        }
    }
    
    // Update program outcomes link
    const outcomesContainer = document.querySelector('.healthcare-stats-outcomes');
    const outcomesLink = document.querySelector('.healthcare-stats-outcomes a');
    if (outcomesContainer) {
        outcomesContainer.style.display = tabData.tab_program_outcomes_link ? '' : 'none';
    }
    if (outcomesLink && tabData.tab_program_outcomes_link) {
        outcomesLink.href = tabData.tab_program_outcomes_link;
    }
};

// Convert video URL to embed URL (Global function)
window.getVideoEmbedUrl = function(url) {
    if (!url) return '';
    
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return 'https://www.youtube.com/embed/' + youtubeMatch[1] + '?autoplay=1&rel=0';
    }
    
    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        return 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?autoplay=1';
    }
    
    // Direct video file or already embed URL
    return url;
};

// Open video modal (Global function)
window.openHealthcareVideoModal = function(videoUrl, isUploaded) {
    if (!videoUrl) return;
    
    const modal = document.getElementById('healthcareVideoModal');
    const container = document.getElementById('healthcareVideoContainer');
    
    if (!modal || !container) return;
    
    // Prevent opening if already active
    if (modal.classList.contains('active')) {
        return;
    }
    
    // CRITICAL: Clear any existing video content first to prevent duplicates
    container.innerHTML = '';
    
    // Stop any playing videos
    const existingVideos = document.querySelectorAll('video');
    existingVideos.forEach(v => {
        v.pause();
        v.src = '';
        v.load();
    });
    
    // Handle uploaded video files
    if (isUploaded === true || /\.(mp4|webm|ogg|mov)$/i.test(videoUrl)) {
        // Use HTML5 video player for uploaded videos
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.setAttribute('controlsList', 'nodownload'); // Prevent download button
        
        const source = document.createElement('source');
        source.src = videoUrl;
        
        // Detect video type
        if (videoUrl.endsWith('.webm')) {
            source.type = 'video/webm';
        } else if (videoUrl.endsWith('.ogg')) {
            source.type = 'video/ogg';
        } else if (videoUrl.endsWith('.mov')) {
            source.type = 'video/quicktime';
        } else {
            source.type = 'video/mp4';
        }
        
        video.appendChild(source);
        video.innerHTML += 'Your browser does not support the video tag.';
        
        // Clear container again before appending (double safety)
        container.innerHTML = '';
        container.appendChild(video);
    } else {
        // Handle external videos (YouTube, Vimeo)
        const embedUrl = window.getVideoEmbedUrl(videoUrl);
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        // Clear container again before appending (double safety)
        container.innerHTML = '';
        container.appendChild(iframe);
    }
    
    // Small delay to ensure content is loaded before showing modal
    setTimeout(function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }, 50);
};

// Close video modal (Global function)
window.closeHealthcareVideoModal = function(event) {
    // Only close if clicking the backdrop or close button
    if (!event || event.target.id === 'healthcareVideoModal' || event.target.classList.contains('healthcare-video-modal-close') || event.target.closest('.healthcare-video-modal-close')) {
        const modal = document.getElementById('healthcareVideoModal');
        const container = document.getElementById('healthcareVideoContainer');
        
        // Stop all videos before closing
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(v => {
            v.pause();
            v.src = '';
            v.load();
        });
        
        // Remove all iframes to stop playback
        const allIframes = container ? container.querySelectorAll('iframe') : [];
        allIframes.forEach(iframe => {
            iframe.src = 'about:blank';
        });
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        if (container) {
            container.innerHTML = ''; // Clear video to stop playback
        }
    }
};

// Initialize event listeners (called after data is loaded)
function initHealthcareEventListeners() {
    // Prevent double initialization
    if (window.healthcareInitialized) return;
    window.healthcareInitialized = true;
    
    // Add click event to healthcare tabs
    const healthcareTabs = document.querySelectorAll('.healthcare-tab');
    healthcareTabs.forEach((tab, index) => {
        tab.addEventListener('click', function(e) {
            // Check if on mobile (768px or less)
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // On mobile: Navigate to the Learn More link
                const tabData = window.healthcareTabsData[index];
                if (tabData && tabData.tab_learn_more_link) {
                    e.preventDefault();
                    window.location.href = tabData.tab_learn_more_link;
                    return;
                }
            }
            
            // Desktop behavior: Switch tabs normally
            window.switchHealthcareTab(index);
        });
    });
    
    // Add click event to video play button
    const videoPlayButton = document.querySelector('.healthcare-video-play');
    if (videoPlayButton) {
        videoPlayButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const videoUrl = this.getAttribute('data-video-url');
            const isUploaded = this.getAttribute('data-is-uploaded') === '1';
            if (videoUrl) {
                window.openHealthcareVideoModal(videoUrl, isUploaded);
            }
        });
    }
    
    // Add click event to modal backdrop and close button
    const modal = document.getElementById('healthcareVideoModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target.id === 'healthcareVideoModal') {
                window.closeHealthcareVideoModal(event);
            }
        });
    }
    
    const closeButton = document.querySelector('.healthcare-video-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            window.closeHealthcareVideoModal(event);
        });
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('healthcareVideoModal');
        if (modal && modal.classList.contains('active')) {
            window.closeHealthcareVideoModal({ target: modal });
        }
    }
});
