export const SAMPLE_VON = `# Application config
{
  name: "atlas",
  version: 1,
  enabled: true,
  ports: [8080, 8443],
  limits: {
    retries: 3,
    timeout_ms: 1500
  }
}`;

export const SAMPLE_JSON = `{
  "name": "atlas",
  "version": 1,
  "enabled": true,
  "ports": [8080, 8443],
  "limits": {
    "retries": 3,
    "timeout_ms": 1500
  }
}
`;

export const SAMPLE_YAML = `name: atlas
version: 1
enabled: true
ports:
  - 8080
  - 8443
limits:
  retries: 3
  timeout_ms: 1500
`;
