const fs = require('fs');

try {
    const lines = fs.readFileSync('index.html', 'utf8').split(/\r?\n/);
    
    // Indices based on 0-based array from previous analysis
    // <style> block was lines 17-1792 (1-based) -> indices 16-1791
    // We keep 0-15 (lines 1-16)
    // We skip 16-1791
    // We keep 1792-2449 (lines 1793-2450)
    // <script> block was lines 2451-2652 (1-based) -> indices 2450-2651
    // We skip 2450-2651
    // We keep 2652-end (lines 2653-end)

    const part1 = lines.slice(0, 16);
    const part2 = lines.slice(1792, 2450);
    const part3 = lines.slice(2652);

    const newContent = [
        ...part1,
        '    <link rel="stylesheet" href="style.css">',
        ...part2,
        '    <script src="script.js"></script>',
        ...part3
    ].join('\r\n');

    fs.writeFileSync('index.html', newContent);
    console.log('Successfully updated index.html');
} catch (e) {
    console.error('Error updating index.html:', e);
    process.exit(1);
}
