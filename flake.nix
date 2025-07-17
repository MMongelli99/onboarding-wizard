{
  description = "multiplatform flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = {
    self,
    nixpkgs,
  }: let
    forEachSystem = supportedSystems: configFor: nixpkgs.lib.mergeAttrsList (map configFor supportedSystems);
  in
    forEachSystem ["aarch64-darwin"] (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.${system} = {
          default = let
            backendHost = "localhost:8000";
            developmentInstance = pkgs.writeShellScriptBin "run-dev" ''
              if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
                  echo "Run this script from the root of the project."
                  exit 1
              fi

              function serve_frontend() {
                  cd frontend
                  npm install
                  npm run dev > /dev/null 2>&1 &
                  FRONTEND_PID=$!
                  cd ..
              }

              function serve_backend() {
                  cd backend
                  VENV=".venv"
                  python -m venv $VENV
                  source $VENV/bin/activate
                  pip install -r requirements.txt
                  gunicorn -b ${backendHost} --access-logfile access.log --error-logfile error.log app:app &
                  BACKEND_PID=$!
                  cd ..
              }

              serve_frontend
              serve_backend

              trap 'kill $BACKEND_PID $FRONTEND_PID; deactivate' INT TERM

              wait
            '';
          in
            pkgs.mkShell {
              name = "onboarding-wizard";
              buildInputs = with pkgs; [
                nodejs_24
                python313
                sqlite
                developmentInstance
              ];
              env = {
                FRONTEND_ORIGIN = "http://localhost:5173";
                VITE_BACKEND_API_BASE = "http://localhost:8000";
              };
            };
        };
      }
    );
}
