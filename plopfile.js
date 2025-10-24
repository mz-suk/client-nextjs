export default function generator(plop) {
  // Feature 제너레이터
  plop.setGenerator('feature', {
    description: 'FSD Feature 생성 (Entity + Feature with API, Hooks, UI)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature 이름은? (예: product, order, comment)',
        validate: value => {
          if (/.+/.test(value)) return true;
          return 'Feature 이름을 입력해주세요';
        },
      },
      {
        type: 'input',
        name: 'endpoint',
        message: 'API 엔드포인트는? (예: /products)',
        default: answers => `/${answers.name}s`,
      },
      {
        type: 'list',
        name: 'stateManagement',
        message: 'State management 방식은?',
        choices: ['SWR', 'TanStack Query', '둘 다'],
        default: '둘 다',
      },
      {
        type: 'confirm',
        name: 'includeDetail',
        message: '단일 항목 조회 API도 생성하시겠습니까? (getOne)',
        default: true,
      },
    ],
    actions: data => {
      const actions = [];

      // Entity 생성
      actions.push(
        {
          type: 'add',
          path: 'src/entities/{{camelCase name}}/model/types.ts',
          templateFile: 'templates/entity/types.ts.hbs',
        },
        {
          type: 'add',
          path: 'src/entities/{{camelCase name}}/model/index.ts',
          template: "export * from './types';\n",
        },
        {
          type: 'add',
          path: 'src/entities/{{camelCase name}}/index.ts',
          template: "export * from './model';\n",
        }
      );

      // Feature API 생성
      actions.push(
        {
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/api/get{{pascalCase name}}s.ts',
          templateFile: 'templates/feature/api/getList.ts.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/api/index.ts',
          template: "export * from './get{{pascalCase name}}s';\n{{#if includeDetail}}export * from './get{{pascalCase name}}';\n{{/if}}",
        }
      );

      if (data.includeDetail) {
        actions.push({
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/api/get{{pascalCase name}}.ts',
          templateFile: 'templates/feature/api/getOne.ts.hbs',
        });
      }

      // Feature Hooks 생성
      if (data.stateManagement === 'SWR' || data.stateManagement === '둘 다') {
        actions.push({
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/hooks/use{{pascalCase name}}s.ts',
          templateFile: 'templates/feature/hooks/useList-swr.ts.hbs',
        });

        if (data.includeDetail) {
          actions.push({
            type: 'add',
            path: 'src/features/{{camelCase name}}-list/hooks/use{{pascalCase name}}.ts',
            templateFile: 'templates/feature/hooks/useOne-swr.ts.hbs',
          });
        }
      }

      if (data.stateManagement === 'TanStack Query' || data.stateManagement === '둘 다') {
        actions.push({
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/hooks/use{{pascalCase name}}sQuery.ts',
          templateFile: 'templates/feature/hooks/useList-query.ts.hbs',
        });

        if (data.includeDetail) {
          actions.push({
            type: 'add',
            path: 'src/features/{{camelCase name}}-list/hooks/use{{pascalCase name}}Query.ts',
            templateFile: 'templates/feature/hooks/useOne-query.ts.hbs',
          });
        }
      }

      // Hooks index
      actions.push({
        type: 'add',
        path: 'src/features/{{camelCase name}}-list/hooks/index.ts',
        templateFile: 'templates/feature/hooks/index.ts.hbs',
      });

      // Feature UI 생성
      actions.push(
        {
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/ui/{{pascalCase name}}List.tsx',
          templateFile: 'templates/feature/ui/List.tsx.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/ui/{{pascalCase name}}List.module.css',
          templateFile: 'templates/feature/ui/List.module.css.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{camelCase name}}-list/ui/index.ts',
          template: "export * from './{{pascalCase name}}List';\n",
        }
      );

      // Feature index
      actions.push({
        type: 'add',
        path: 'src/features/{{camelCase name}}-list/index.ts',
        template: "export * from './api';\nexport * from './hooks';\nexport * from './ui';\n",
      });

      return actions;
    },
  });

  // Component 제너레이터
  plop.setGenerator('component', {
    description: 'UI 컴포넌트 생성 (shared/ui)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '컴포넌트 이름은? (예: Button, Card)',
        validate: value => {
          if (/.+/.test(value)) return true;
          return '컴포넌트 이름을 입력해주세요';
        },
      },
      {
        type: 'confirm',
        name: 'withStyles',
        message: 'CSS Module을 생성하시겠습니까?',
        default: true,
      },
    ],
    actions: data => {
      const actions = [
        {
          type: 'add',
          path: 'src/shared/ui/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: 'templates/component/Component.tsx.hbs',
        },
        {
          type: 'add',
          path: 'src/shared/ui/{{pascalCase name}}/index.ts',
          template: "export * from './{{pascalCase name}}';\n",
        },
      ];

      if (data.withStyles) {
        actions.push({
          type: 'add',
          path: 'src/shared/ui/{{pascalCase name}}/{{pascalCase name}}.module.css',
          templateFile: 'templates/component/Component.module.css.hbs',
        });
      }

      return actions;
    },
  });

  // Hook 제너레이터
  plop.setGenerator('hook', {
    description: 'Custom Hook 생성 (shared/hooks)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Hook 이름은? (use 제외, 예: LocalStorage, WindowSize)',
        validate: value => {
          if (/.+/.test(value)) return true;
          return 'Hook 이름을 입력해주세요';
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/shared/hooks/use{{pascalCase name}}.ts',
        templateFile: 'templates/hook/useHook.ts.hbs',
      },
      {
        type: 'append',
        path: 'src/shared/hooks/index.ts',
        pattern: /(\/\/ -- APPEND HOOK EXPORT HERE --)/gi,
        template: "export * from './use{{pascalCase name}}';\n",
      },
    ],
  });

  // Page 제너레이터
  plop.setGenerator('page', {
    description: 'Next.js 페이지 생성 (app directory)',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: '페이지 경로는? (예: dashboard, settings/profile)',
        validate: value => {
          if (/.+/.test(value)) return true;
          return '페이지 경로를 입력해주세요';
        },
      },
      {
        type: 'list',
        name: 'type',
        message: '페이지 타입은?',
        choices: ['Server Component', 'Client Component'],
        default: 'Server Component',
      },
    ],
    actions: data => {
      const actions = [
        {
          type: 'add',
          path: 'src/app/{{path}}/page.tsx',
          templateFile: `templates/page/${data.type === 'Client Component' ? 'client-page.tsx.hbs' : 'server-page.tsx.hbs'}`,
        },
      ];

      return actions;
    },
  });
}
