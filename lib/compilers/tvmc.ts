import path from 'path';
import {BaseCompiler} from '../base-compiler.js';
import type {ParseFiltersAndOutputOptions} from '../../types/features/filters.interfaces.js';
import type {PreliminaryCompilerInfo} from '../../types/compiler.interfaces.js';
import {ExecutionOptions} from '../../types/compilation/compilation.interfaces.js';

export class TVMCCompiler extends BaseCompiler {
    static get key() {
        return 'tvmc';
    }
    constructor(info: PreliminaryCompilerInfo, env) {
        super(info, env);
        this.compiler.demangler = '';
        this.demanglerClass = null;
        // this.compiler.supportsIntel = true;
        // this.compiler.supportsLLVMOptPipelineView = true;
        // this.compiler.llvmOptArg = ['-print-after-all', '-print-before-all'];
        // this.compiler.llvmOptModuleScopeArg = ['-print-module-scope'];
        // this.compiler.llvmOptNoDiscardValueNamesArg = [];
    }

    override optionsForFilter(filters: ParseFiltersAndOutputOptions, outputFilename: string) {
        return ['-o', this.filename(outputFilename).split('.').slice(0, -1).join('.')];
        // if (filters.intel && !filters.binary) options = options.concat('-x86-asm-syntax=intel');
        // if (filters.binary) options = options.concat('-filetype=obj');
    }

    // override getArgumentParser() {
    //     return ClangParser;
    // }

    // override getOutputFilename(dirPath: string, outputFilebase: string, key?: any): string {
    //     // if (key && key.filters && key.filters.binary) {
    //     //     return path.join(dirPath, 'output');
    //     // } else if (key && key.filters && key.filters.binaryObject) {
    //     //     return path.join(dirPath, 'output.o');
    //     // } else {
    //     //     return path.join(dirPath, 'output.s');
    //     // }
    //     return path.join(dirPath, 'output.tar');
    // }
    override getOutputFilename(dirPath, outputFilebase) {
        return path.join(dirPath, `${outputFilebase}.ll`);
    }

    // override getCompilerResultLanguageId(): string | undefined {
    //     return 'llvm-ir';
    // }

    override async runCompiler(
        compiler: string,
        options: string[],
        inputFilename: string,
        execOptions: ExecutionOptions & {env: Record<string, string>},
    ) {
        if (!execOptions) {
            execOptions = this.getDefaultExecOptions();
        }

        execOptions.customCwd = path.dirname(inputFilename);

        return await super.runCompiler(
            compiler,
            ['compile'].concat(options).concat(['--dump-code', 'll']),
            inputFilename,
            execOptions,
        );
    }
}
