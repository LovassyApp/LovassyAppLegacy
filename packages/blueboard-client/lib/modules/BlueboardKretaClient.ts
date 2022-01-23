import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardKretaGradeDataFactory from "../factories/BlueboardKretaGradeDataFactory";

class BlueboardKretaClient extends BlueboardBaseClient {
    public grades = async (refresh: boolean = false, forcedToken?: string) => {
        const url = this.endpoints.kreta.grades;

        const res = BlueboardKretaGradeDataFactory.getResponse(
            forcedToken
                ? await this.stdGetRequest(
                      url,
                      {},
                      { refresh: refresh },
                      {
                          Authorization: "Bearer " + forcedToken,
                          Accept: "application/json",
                      }
                  )
                : await this.stdGetRequest(url, {}, { refresh: refresh })
        );

        return res;
    };
}

export default BlueboardKretaClient;
