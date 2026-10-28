# Local micro1 refresh

micro1's API blocks GitHub-hosted runners (HTTP 403 since 2026-10-25), so the daily refresh runs on Pete's Mac.

- Script: `scripts/refresh_local.sh` (own clone at `~/.local/share/artificialjobs-refresh`, pushes to master, which deploys)
- Schedule: `scripts/dev.artificialjobs.refresh.plist`, installed to `~/Library/LaunchAgents/`, daily 07:20 local; runs on wake if the Mac was asleep
- Install: `cp scripts/dev.artificialjobs.refresh.plist ~/Library/LaunchAgents/ && launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/dev.artificialjobs.refresh.plist`
- Log: `~/Library/Logs/artificialjobs-refresh.log`
- Run now: `launchctl kickstart gui/$(id -u)/dev.artificialjobs.refresh`
- Remove: `launchctl bootout gui/$(id -u)/dev.artificialjobs.refresh && rm ~/Library/LaunchAgents/dev.artificialjobs.refresh.plist`
