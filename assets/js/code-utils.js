document.addEventListener('DOMContentLoaded', function () {
  // Jekyll/Rouge wraps highlighted blocks in:
  //   <div class="language-swift highlighter-rouge">
  //     <div class="highlight"><pre class="highlight"><code>...</code></pre></div>
  //   </div>
  var blocks = document.querySelectorAll('div.highlighter-rouge');

  blocks.forEach(function (block) {
    // Extract language name from "language-*" class
    var lang = '';
    block.classList.forEach(function (cls) {
      if (cls.startsWith('language-') && cls !== 'language-plaintext') {
        lang = cls.replace('language-', '');
      }
    });

    // Wrap the block in a .code-wrapper div
    var wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    // Language label badge (top-left)
    if (lang) {
      var label = document.createElement('span');
      label.className = 'code-lang-label';
      label.textContent = lang;
      wrapper.appendChild(label);
    }

    // Copy button (top-right)
    var copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.innerHTML = copyIcon();
    wrapper.appendChild(copyBtn);

    copyBtn.addEventListener('click', function () {
      var codeEl = block.querySelector('code');
      var text = codeEl ? codeEl.innerText : '';

      navigator.clipboard.writeText(text).then(function () {
        copyBtn.innerHTML = checkIcon();
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.innerHTML = copyIcon();
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
          copyBtn.innerHTML = checkIcon();
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.innerHTML = copyIcon();
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (e) {}
        document.body.removeChild(textarea);
      });
    });
  });

  function copyIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  }

  function checkIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  }
});
