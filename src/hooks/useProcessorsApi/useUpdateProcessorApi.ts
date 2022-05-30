import {
  Configuration,
  ProcessorResponse,
  ProcessorRequest,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

export function useUpdateProcessorApi(): {
  updateProcessor: (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ) => void;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
  }, [auth]);

  const updateProcessor = (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ): void => {
    setIsLoading(true);
    setError(undefined);
    setProcessor(undefined);
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath: config.smart_events.apiBasePath,
      })
    );
    processorsApi
      .updateProcessor(bridgeId, processorId, processorRequest)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { updateProcessor, isLoading, processor, error };
}
