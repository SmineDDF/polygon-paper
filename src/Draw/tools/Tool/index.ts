import paper from 'paper';

export interface IAttachedTool {
    activateTool(): void;
    deactivateTool(): void;
    attachTo(paperTool: Tool): void;
    detach(): void;
}

class Tool extends paper.Tool {
    attachedTools: IAttachedTool[];

    constructor() {
        super();

        this.attachedTools = [];
    }

    public attachTool(tool: IAttachedTool) {
        if (this.attachedTools.includes(tool)) {
            return;
        }

        this.attachedTools.push(tool);
        tool.attachTo(this);
    }

    public detachTool(tool: IAttachedTool) {
        let toolIndex = this.attachedTools.indexOf(tool);

        if (toolIndex === -1) {
            return;
        }

        this.attachedTools.splice(toolIndex, 1);
        tool.detach();
    }

    public activateAllAttachedTools() {
        this.attachedTools.forEach(t => t.activateTool());
    }

    public deactivateAllAttachedTools() {
        this.attachedTools.forEach(t => t.deactivateTool());
    }

    public deactivateAllToolsExcept(tool: IAttachedTool) {
        this.attachedTools.forEach(t => {
            if (t !== tool) {
                t.deactivateTool();
            }
        })
    } 
}

export { Tool };