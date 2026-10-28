import { CAPABILITIES, LIFECYCLE } from "../app/catalog";
import { PageHeader } from "../ui/bits";

export function Capabilities() {
  return (
    <section className="page">
      <PageHeader
        kicker="Models, skills, tools, knowledge"
        title="Candidates only. Registry not mounted."
        lede="These names come from the owner directive. This preview did not search a mounted capability registry, did not download upstream source, and did not record a licence review. A blank cell means not recorded here, which is silent about the Kubuntu machine."
      />
      <section className="panel">
        <div className="inline spread">
          <h2>Lifecycle</h2>
          <button type="button" className="btn" disabled>
            Acquire selected
          </button>
        </div>
        <p className="reason">Acquisition stays closed until the existing registry has been searched and the owner gate is open.</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Kind</th>
                {LIFECYCLE.map((stage) => (
                  <th key={stage}>{stage}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((capability) => (
                <tr key={capability.id} data-testid="capability-row">
                  <th scope="row">
                    {capability.name}
                    <span className="reason">{capability.purpose}</span>
                  </th>
                  <td>{capability.kind}</td>
                  {LIFECYCLE.map((stage) => (
                    <td key={stage}>{capability.stages[stage] === "not-recorded" ? "Not recorded" : capability.stages[stage]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
