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
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_24
              python310
              sqlite
            ];
          };
        };
      }
    );
}
