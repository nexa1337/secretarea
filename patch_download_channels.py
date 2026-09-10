import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

replacement = """                      {/* Pre-Installed / SteamUnlocked */}
                      {item.links.preInstalled && (item.links.preInstalled.download || item.links.preInstalled.cloudDrop || item.links.preInstalled.torrent) && (
                          <details className="mb-6 group">
                              <summary className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors select-none list-none">
                                  <Icon name="ChevronRight" size={14} className="group-open:rotate-90 transition-transform" />
                                  <img src="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/802345/unnamed-b4a32b8b-803c-454f-a411-5a9c33494c3c.jpg" alt="SteamUnlocked" className="w-4 h-4 rounded-sm object-contain" /> {t('Pre-Installed / SteamUnlocked')}
                              </summary>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                                  {item.links.preInstalled.download && (
                                      <DownloadButton
                                          label={`Download (${item.originalSize || item.repackSize || 'Size N/A'})`}
                                          sub={t('Direct Link')}
                                          href={item.links.preInstalled.download}
                                          icon="Download"
                                          imageUrl="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/802345/unnamed-b4a32b8b-803c-454f-a411-5a9c33494c3c.jpg"
                                          secondary
                                      />
                                  )}
                                  {item.links.preInstalled.cloudDrop && (
                                      <DownloadButton
                                          label="CloudDrop Mirror"
                                          sub={t('Mirror Link')}
                                          href={item.links.preInstalled.cloudDrop}
                                          icon="Cloud"
                                          imageUrl="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/802345/unnamed-b4a32b8b-803c-454f-a411-5a9c33494c3c.jpg"
                                          secondary
                                      />
                                  )}
                                  {item.links.preInstalled.torrent && (
                                      <DownloadButton
                                          label="utorrent File"
                                          sub={t('Torrent')}
                                          href={item.links.preInstalled.torrent}
                                          icon="Magnet"
                                          imageUrl="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/802345/unnamed-b4a32b8b-803c-454f-a411-5a9c33494c3c.jpg"
                                          secondary
                                          onClick={(e) => {
                                              e.preventDefault();
                                              setTorrentWarningLink(item.links.preInstalled?.torrent || null);
                                          }}
                                      />
                                  )}
                              </div>
                          </details>
                      )}
                      
                      {( (item.links.mirrors && item.links.mirrors.length > 0) || (item.links.parts && item.links.parts.length > 0) ) && ("""

pattern = r"\{\(\s*\(\s*item\.links\.mirrors\s*&&\s*item\.links\.mirrors\.length\s*>\s*0\s*\)\s*\|\|\s*\(\s*item\.links\.parts\s*&&\s*item\.links\.parts\.length\s*>\s*0\s*\)\s*\)\s*&&\s*\("
new_content = re.sub(pattern, replacement, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(new_content)
