import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

export const swaggerUiMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,

      responseInterceptor: (response: {
        url?: string;
        status?: number;
        text?: string;
      }) => {
        if (response.url?.includes("/auth/login") && response.status === 200) {
          const data = JSON.parse(response.text || "{}");

          if (data.accessToken && typeof window !== "undefined") {
            const swaggerWindow = window as typeof window & {
              ui?: {
                preauthorizeApiKey: (name: string, value: string) => void;
              };
            };

            swaggerWindow.ui?.preauthorizeApiKey(
              "BearerAuth",
              data.accessToken,
            );
          }
        }

        return response;
      },
    },
  }),
];
