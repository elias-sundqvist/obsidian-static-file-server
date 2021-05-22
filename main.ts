import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import staticServer, { StaticServer } from './static-server';

interface StaticFileServerPluginSettings {
    vaultMaps: Record<string, string>;
}

const DEFAULT_SETTINGS: StaticFileServerPluginSettings = {
    vaultMaps: {}
};

export default class StaticFileServerPlugin extends Plugin {
    settings: StaticFileServerPluginSettings;
    webservers: StaticServer[];

    async onload() {
        this.webservers = [];
        await this.loadSettings();
        this.restartServers();
        this.addSettingTab(new SettingTab(this.app, this));
    }

    shutDownServers() {
        this.webservers.forEach(s => s.close());
        this.webservers = [];
    }

    restartServers() {
        this.shutDownServers();
        for (const [port, path] of Object.entries(this.settings.vaultMaps)) {
            const ws = staticServer(path, port, this);
            ws.listen();
            this.webservers.push(ws);
        }
    }

    onunload() {
        this.shutDownServers();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SettingTab extends PluginSettingTab {
    plugin: StaticFileServerPlugin;

    constructor(app: App, plugin: StaticFileServerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Static file server settings' });

        let i = 1;
        [...Object.entries(this.plugin.settings.vaultMaps), ['', '']].forEach(([port, path]) => {
            new Setting(containerEl)
                .setName(`port #${i}`)
                .setDesc('The port number')
                .addText(text =>
                    text
                        .setPlaceholder('e.g. 1337')
                        .setValue(port)
                        .onChange(async newPort => {
                            if (Number(newPort)) {
                                delete this.plugin.settings.vaultMaps[port];
                                port = newPort;
                                this.plugin.settings.vaultMaps[port] = path;
                            }
                        })
                );
            new Setting(containerEl)
                .setName(`folder #${i}`)
                .setDesc(`The vault folder served for port #${i}`)
                .addText(text =>
                    text
                        .setPlaceholder('e.g. FolderName')
                        .setValue(path)
                        .onChange(async newPath => {
                            this.plugin.settings.vaultMaps[port] = newPath;
                            path = newPath;
                        })
                );
            i++;
        });

        new Setting(containerEl).addButton(button =>
            button.setButtonText('Revert').onClick(async () => {
                await this.plugin.loadSettings();
                this.plugin.restartServers();
                this.display();
            })
        );

        new Setting(containerEl).addButton(button =>
            button.setButtonText('Apply').onClick(async () => {
                await this.plugin.saveSettings();
                this.plugin.restartServers();
                this.display();
            })
        );
    }
}
