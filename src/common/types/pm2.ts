interface PM2Env {
  kill_retry_time: number;
  windowsHide: boolean;
  username: string;
  treekill: boolean;
  automation: boolean;
  pmx: boolean;
  instance_var: string;
  watch: boolean;
  autorestart: boolean;
  autostart: boolean;
  vizion: boolean;
  merge_logs: boolean;
  env: Record<string, string>;
  unique_id: string;
  pm_uptime: number;
  status: "stopped" | "online";
  [key: string]: unknown;
}

interface PM2Monit {
  memory: number;
  cpu: number;
}

interface PM2ProcessItem {
  pid: number;
  name: string;
  pm2_env: PM2Env;
  exec_interpreter: string;
  namespace: string;
  filter_env: string[];
  node_args: string[];
  pm_exec_path: string;
  pm_cwd: string;
  exec_mode: string;
  instances: number;
  pm_out_log_path: string;
  pm_err_log_path: string;
  pm_pid_path: string;
  km_link: boolean;
  vizion_running: boolean;
  NODE_APP_INSTANCE: number;
  EDITOR: string;
  ELECTRON_OZONE_PLATFORM_HINT: string;
  HOME: string;
  LANG: string;
  LC_ALL: string;
  LESS: string;
  LOGNAME: string;
  LSCOLORS: string;
  LS_COLORS: string;
  NIX_PROFILES: string;
  NIX_SSL_CERT_FILE: string;
  OLDPWD: string;
  PAGER: string;
  PATH: string;
  PWD: string;
  SHELL: string;
  SHLVL: string;
  SSH_CLIENT: string;
  SSH_CONNECTION: string;
  SSH_TTY: string;
  STARSHIP_SESSION_KEY: string;
  STARSHIP_SHELL: string;
  TERM: string;
  TERM_PROGRAM: string;
  TERM_PROGRAM_VERSION: string;
  TMPDIR: string;
  TMUX: string;
  TMUX_PANE: string;
  USER: string;
  VISUAL: string;
  XDG_DATA_DIRS: string;
  ZSH: string;
  _: string;
  __CF_USER_TEXT_ENCODING: string;
  PM2_USAGE: string;
  PM2_HOME: string;
  unique_id: string;
  status: string;
  pm_uptime: number;
  axm_actions: unknown[];
  axm_monitor: Record<string, unknown>;
  axm_options: Record<string, unknown>;
  axm_dynamic: Record<string, unknown>;
  created_at: number;
  pm_id: number;
  restart_time: number;
  unstable_restarts: number;
  version: string;
}

export interface PM2Process {
  pid: number;
  name: string;
  pm2_env: PM2Env;
  pm_id: number;
  monit: PM2Monit;
}
